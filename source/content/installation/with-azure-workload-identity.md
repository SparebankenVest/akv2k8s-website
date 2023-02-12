---
title: "Installing with Azure AD Workload Identity"
description: "Learn what needs to be done to run successfully with azure ad workload identity"
---

## Requirements

Additional to the default [requirements](requirements) using Workload Identity with akv2k8s requires:

- Managed or self-managed cluster with the azure-workload-identity-webhook installed and OIDC issuer URL configured https://azure.github.io/azure-workload-identity/docs/

## Installation

Create a managed identity

```shell
export RG_NAME="<resource-group>"
export USER_ASSIGNED_IDENTITY_NAME="<identity-name>"
az identity create --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RG_NAME}"

```

Grant permissions to access Azure Key Vault

```shell
export KEYVAULT_NAME="<keyvault-name>"
export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group ${RG_NAME} --name ${USER_ASSIGNED_IDENTITY_NAME} --query 'clientId' -otsv)"
az keyvault set-policy \
        --name "${KEYVAULT_NAME}" \
        --secret-permissions get \
        --certificate-permissions get \
        --key-permissions get \
        --spn "${USER_ASSIGNED_CLIENT_ID}"
```

Get the OIDC issuer url. If running on AKS the following command can be used

```shell
export AKS_NAME="<aks-name>"
export RG_NAME="<aks-resource-group>"
export OIDC_ISSUER_URL="$(az aks show -n ${AKS_NAME} -g ${RG_NAME} --query "oidcIssuerProfile.issuerUrl" -otsv)"
```

Establish federated identity credential for akv2k8s-controller service account

```shell
export SERVICE_ACCOUNT_NAMESPACE="akv2k8s"
export SERVICE_ACCOUNT_NAME="akv2k8s-controller"
az identity federated-credential create \
        --name akv2k8s-controller-fed-identity \
        --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" \
        --resource-group "${RG_NAME}" \
        --issuer "${AKS_OIDC_ISSUER}" \
        --subject system:serviceaccount:"${SERVICE_ACCOUNT_NAMESPACE}":"${SERVICE_ACCOUNT_NAME}"
```

Establish federated identity credential for akv2k8s-envinjector service account

```shell
export SERVICE_ACCOUNT_NAMESPACE="akv2k8s"
export SERVICE_ACCOUNT_NAME="akv2k8s-envinjector"
az identity federated-credential create \
        --name akv2k8s-envinjector-fed-identity \
        --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" \
        --resource-group "${RG_NAME}" \
        --issuer "${AKS_OIDC_ISSUER}" \
        --subject system:serviceaccount:"${SERVICE_ACCOUNT_NAMESPACE}":"${SERVICE_ACCOUNT_NAME}"
```

Enable keyvault auth `environment-azidentity` and add the `azure.workload.identity/use: "true"` label on the service account and pod for controller and envinjector.

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
