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

## Installation

Create a managed identity:

```bash
export RG_NAME="<resource-group>"
export USER_ASSIGNED_IDENTITY_NAME="<identity-name>"

az identity create \
  --name "${USER_ASSIGNED_IDENTITY_NAME}" \
  --resource-group "${RG_NAME}"
```

Grant permissions to access Azure Key Vault:

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

Get the OIDC issuer URL. On AKS:

```bash
export AKS_NAME="<aks-name>"
export AKS_RG_NAME="<aks-resource-group>"
export OIDC_ISSUER_URL="$(az aks show \
  --name "${AKS_NAME}" \
  --resource-group "${AKS_RG_NAME}" \
  --query 'oidcIssuerProfile.issuerUrl' \
  -o tsv)"
```

Establish a federated identity credential for the akv2k8s Controller service account:

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

Establish a federated identity credential for the akv2k8s Env-Injector service account:

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

Enable Key Vault auth `environment-azidentity` and add the `azure.workload.identity/use: "true"` label on the service account and pod for the Controller and Env-Injector.

Client ID for managed identity must either be set as environment variable `AZURE_CLIENT_ID` or added with `azure.workload.identity/client-id` annotation on each service account for controller and envinjector

```yaml
global:
  keyVaultAuth: environment-azidentity
controller:
  podLabels:
    azure.workload.identity/use: "true"
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: <optional-managed-identity-client-id>
    labels:
      azure.workload.identity/use: "true"
env_injector:
  podLabels:
    azure.workload.identity/use: "true"
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: <optional-managed-identity-client-id>
    labels:
      azure.workload.identity/use: "true"
```

`environment-azidentity` uses Azure SDK `DefaultAzureCredential`. With Azure Workload Identity, the workload identity webhook injects the environment variables and token file used by that credential.
