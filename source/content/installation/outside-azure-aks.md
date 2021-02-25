---
title: "Installing outside Azure AKS"
description: "Learn how to install Azure Key Vault to Kubernetes outside Azure AKS"
---

> Make sure to check the [requirements](requirements) before installing.

## About Custom Resource Definitions

On first install, the Helm Chart will add the `AzureKeyVaultSecret` CRD to Kubernetes if it does not already exists. On later upgrades or if it already exists, any changed to the CRD will not be updated by the Helm Chart. This is by design: https://helm.sh/docs/chart_best_practices/custom_resource_definitions/#method-1-let-helm-do-it-for-you

NOTE: When upgrading Azure Key Vault to Kubernetes, manually apply CRDs before upgrade. Latest CRDs will always be available at https://github.com/sparebankenvest/azure-key-vault-to-kubernetes/crds and can be installed manually by:

```
kubectl apply -f https://raw.githubusercontent.com/sparebankenvest/azure-key-vault-to-kubernetes/master/crds/AzureKeyVaultSecret.yaml
```

In versions <=1.2 of Akv2k8s only the `AzureKeyVaultSecret` CRD is needed.

>Note: If you delete the `AzureKeyVaultSecret` CRD from Kubernetes, all resources of type `AzureKeyVaultSecret` created in cluster will be removed. This is by design: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#delete-a-customresourcedefinition

## Installation

### Create a dedicated namespace

A dedicated namespace needs to be created for akv2k8s:

```bash
kubectl create ns akv2k8s
```

...or provide `--create-namespace` with Helm 3.

### Installing with Helm outside Azure AKS

When running **inside** Azure AKS, Akv2k8s will use the AKS cluster credentials by default to authenticate with Azure Key Vault. **Outside** Azure AKS - credentials must be provided by setting `env_injector.keyVaultAuth=environment` and provide credentials as documented under [Authentication](../security/authentication).

Add Helm repository:

```bash
helm repo add spv-charts https://charts.spvapi.no
helm repo update
```

Example of installing akv2k8s using client-id/secret as Azure Key Vault credentials:

```
helm upgrade --install akv2k8s spv-charts/akv2k8s \
  --namespace akv2k8s \
  --set global.keyVaultAuth=environment \
  --set global.env.AZURE_TENANT_ID=<tenant-id> \
  --set global.env.AZURE_CLIENT_ID=<client-id> \
  --set global.env.AZURE_CLIENT_SECRET=<client-secret>
```

### Legacy Charts

Prior to Akv2k8s version 1.1, two Helm charts existed: `azure-key-vault-controller` and `azure-key-vault-env-injector`. These are deprecated in favor of the new `akv2k8s` chart. The old Charts used Helm 2 and the new Chart uses Helm 3. For this reason we still maintain the old charts for version 1.1, but we will not maintain future versions after 1.1. Those will only be available in the `akv2k8s` Chart.

