---
title: "Installing with Azure Workload Identity"
description: "Learn how to run akv2k8s with Azure Workload Identity"
---

Azure Workload Identity can be used with akv2k8s by setting Key Vault authentication to `environment-azidentity`. This makes the Controller and Env-Injector use Azure SDK `DefaultAzureCredential`, which can authenticate from the projected workload identity token.

## Requirements

In addition to the default [requirements](requirements), the Kubernetes cluster must have Azure Workload Identity configured:

* Azure Workload Identity webhook installed
* OIDC issuer URL configured for the cluster
* A managed identity with access to the Azure Key Vault objects akv2k8s should read

See the [Azure Workload Identity documentation](https://azure.github.io/azure-workload-identity/docs/) for cluster setup details.

## Create a Managed Identity

```bash
export RG_NAME="<resource-group>"
export USER_ASSIGNED_IDENTITY_NAME="<identity-name>"

az identity create \
  --name "${USER_ASSIGNED_IDENTITY_NAME}" \
  --resource-group "${RG_NAME}"
```

Grant the identity access to Azure Key Vault:

```bash
export KEYVAULT_NAME="<keyvault-name>"
export USER_ASSIGNED_CLIENT_ID="$(az identity show \
  --resource-group "${RG_NAME}" \
  --name "${USER_ASSIGNED_IDENTITY_NAME}" \
  --query 'clientId' \
  -o tsv)"

az keyvault set-policy \
  --name "${KEYVAULT_NAME}" \
  --secret-permissions get \
  --certificate-permissions get \
  --key-permissions get \
  --spn "${USER_ASSIGNED_CLIENT_ID}"
```

## Configure Federated Credentials

Get the cluster OIDC issuer URL. On AKS:

```bash
export AKS_NAME="<aks-name>"
export AKS_RG_NAME="<aks-resource-group>"
export OIDC_ISSUER_URL="$(az aks show \
  --name "${AKS_NAME}" \
  --resource-group "${AKS_RG_NAME}" \
  --query 'oidcIssuerProfile.issuerUrl' \
  -o tsv)"
```

Create a federated credential for the controller service account:

```bash
export SERVICE_ACCOUNT_NAMESPACE="akv2k8s"
export SERVICE_ACCOUNT_NAME="akv2k8s-controller"

az identity federated-credential create \
  --name akv2k8s-controller \
  --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" \
  --resource-group "${RG_NAME}" \
  --issuer "${OIDC_ISSUER_URL}" \
  --subject "system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
```

Create a federated credential for the Env-Injector service account:

```bash
export SERVICE_ACCOUNT_NAMESPACE="akv2k8s"
export SERVICE_ACCOUNT_NAME="akv2k8s-envinjector"

az identity federated-credential create \
  --name akv2k8s-envinjector \
  --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" \
  --resource-group "${RG_NAME}" \
  --issuer "${OIDC_ISSUER_URL}" \
  --subject "system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
```

## Install with Helm

Set `global.keyVaultAuth` to `environment-azidentity`, label the Controller and Env-Injector pods and service accounts, and provide the managed identity client ID through the service account annotation.

```yaml
global:
  keyVaultAuth: environment-azidentity
controller:
  podLabels:
    azure.workload.identity/use: "true"
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: <managed-identity-client-id>
    labels:
      azure.workload.identity/use: "true"
env_injector:
  podLabels:
    azure.workload.identity/use: "true"
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: <managed-identity-client-id>
    labels:
      azure.workload.identity/use: "true"
```

Apply those values when installing or upgrading akv2k8s:

```bash
helm upgrade --install akv2k8s spv-charts/akv2k8s \
  --namespace akv2k8s \
  --values values.yaml
```

## Authentication Mode

`environment-azidentity` uses Azure SDK `DefaultAzureCredential`. In a Workload Identity setup, the Azure Workload Identity webhook injects the required environment variables and token file into the akv2k8s pods.

If `azure.workload.identity/client-id` is not set on the service account, provide `AZURE_CLIENT_ID` another way that is visible to the Controller and Env-Injector pods.
