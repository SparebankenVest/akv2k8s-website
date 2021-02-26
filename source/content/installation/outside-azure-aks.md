---
title: "Installing outside Azure AKS"
description: "Learn how to install Azure Key Vault to Kubernetes outside Azure AKS"
---

> Make sure to check the [requirements](requirements) before installing.

Azure Key Vault is a Microsoft Azure product and Azure Key Vault to Kubernetes (akv2k8s) is most commonly used on Azure AKS (see [Installing on Azure AKS](on-azure-aks)), but can also be used outside Azure AKS. Because of this a few more settings needs to be provided in order to have akv2k8s run successfully outside Azure AKS.

Akv2k8s rely heavily on Helm to configure its Kubernetes resources. If Helm is not an option, see [Installing without Helm](without-helm).

## Configurations

The akv2k8s Helm chart support many [configuration options](https://github.com/SparebankenVest/public-helm-charts/blob/master/stable/akv2k8s/README.md#configuration). Here is a set of mandatory settings that must be provided in order to run akv2k8s outside Azure AKS:

```
--set global.keyVaultAuth=environment
``` 

The above settings tells akv2k8s to look for Azure Key Vault credentials in environment variables. The available options are documented by Microsoft here: https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-environment-variables (see example below).

## Other Configurations

* `global.logLevel` - is `info` by default. To increase log level use either `debug` or `trace`.
* `global.logFormat` - is `text` by default. To use json, set log format to `json`.

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

