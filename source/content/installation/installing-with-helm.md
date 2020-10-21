---
title: "Installation with Helm"
description: "How to install Azure Key Vault to Kubernetes with Helm"
---

> Make sure to check the [requirements](requirements) before installing. 

## About Custom Resource Difinitions

On first install, the Helm Chart will add the `AzureKeyVaultSecret` CRD to Kubernetes if it does not already exists. On later upgrades or if it already exists, any changed to the CRD will not be updated by the Helm Chart. This is by design: https://helm.sh/docs/chart_best_practices/custom_resource_definitions/#method-1-let-helm-do-it-for-you

Taking that into account, the recommendation is to install CRDs manually before any upgrades. Latest CRDs will always be available at https://github.com/sparebankenvest/azure-key-vault-to-kubernetes/crds and can be installed manually by:

```
kubectl apply -f https://raw.githubusercontent.com/sparebankenvest/azure-key-vault-to-kubernetes/master/crds/AzureKeyVaultSecret.yaml
```

In version 1.1 of Akv2k8s only the `AzureKeyVaultSecret` CRD is needed.

>Note: If you delete the `AzureKeyVaultSecret` CRD from Kubernetes, all resources of type `AzureKeyVaultSecret` created in cluster will be removed. This is by design: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#delete-a-customresourcedefinition

## Create a dedicated namespace

A dedicated namespace needs to be created for akv2k8s:

```bash
kubectl create ns akv2k8s
```

...or provide `--create-namespace` with Helm.

## Installation

### Installing with Helm on Azure AKS

Add Helm repository:

```bash
helm repo add spv-charts http://charts.spvapi.no
helm repo update
```

Install both Controller and Env-Injector:

```bash
helm upgrade --install akv2k8s spv-charts/akv2k8s \
  --namespace akv2k8s 
```

The Controller is required as the Env-Injector depends on it, but you can omit the Env-Injector:

```
helm upgrade --install akv2k8s spv-charts/akv2k8s \
  --env_injector.enabled=false \ 
  --namespace akv2k8s 
```

For detailed options, see the [Helm chart for akv2k8s](https://github.com/SparebankenVest/public-helm-charts/tree/master/stable/akv2k8s):

### Installing with Helm outside Azure AKS 

When running **inside** Azure AKS, Akv2k8s will use the AKS cluster credentials by default to authenticate with Azure Key Vault. **Outside** Azure AKS - credentials must be provided by setting `keyVault.customAuth=true` and provide credentials as documented under [Authentication](../security/authentication).

Create `akv2k8s` namespace:

```bash
kubectl create ns akv2k8s
```

Add Helm repository:

```bash
helm repo add spv-charts http://charts.spvapi.no
helm repo update
```

Install both Controller and Env-Injector:

```bash
helm upgrade -i akv2k8s spv-charts/akv2k8s \
   --namespace akv2k8s \
   --set keyVault.customAuth.enabled=true \
   --set env.AZURE_TENANT_ID=<tenant-id> \
   --set env.AZURE_CLIENT_ID=<client-id> \
   --set env.AZURE_CLIENT_SECRET=<client-secret>
```

### Legacy Charts

Prior to Akv2k8s version 1.1 two Helm charts existed: `azure-key-vault-controller` and `azure-key-vault-env-injector`. These are deprecated in favor of the new `akv2k8s` chart. The old Charts used Helm 2 and the new Chart uses Helm 3. For this reason we still maintain the old charts for version 1.1, but we will not maintain future versions after 1.1. Those will only be available in the `akv2k8s` Chart.

