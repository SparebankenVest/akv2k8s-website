---
title: "Installing on Azure AKS"
description: "How to install Azure Key Vault to Kubernetes (akv2k8s) on Azure AKS"
---

> Make sure to check the [requirements](requirements) before installing.

Azure Key Vault is a Microsoft Azure product and Azure Key Vault to Kubernetes (akv2k8s) is most commonly used on Azure AKS, but can also be used outside Azure AKS (see [Installing outside Azure AKS](outside-azure-aks)). Because of this, the default installation settings are based on running on Azure AKS and should install successfully without any configuration changes. 

Akv2k8s rely heavily on Helm to configure its Kubernetes resources. If Helm is not an option, see [Installing without Helm](without-helm).

## Configurations

The akv2k8s Helm chart support many [configuration options](https://github.com/SparebankenVest/public-helm-charts/blob/master/stable/akv2k8s/README.md#configuration). Here is a few to consider before installing:

* `global.keyVaultAuth` - by default akv2k8s uses the same credentials as Azure AKS (`azureCloudConfig`) to authenticate with Azure Key Vault. To use different credentials see [Authentication with Azure Key Vault](../security/authentication).
* `global.logLevel` - is `info` by default. To increase log level use either `debug` or `trace`.
* `global.logFormat` - is `text` by default. To use json, set log format to `json`.

## Installation

### Create a dedicated namespace

A dedicated namespace needs to be created for akv2k8s:

```bash
kubectl create ns akv2k8s
```

...or provide `--create-namespace` with Helm 3 below.

### Installing with Helm on Azure AKS

Add Helm repository:

```bash
helm repo add spv-charts https://charts.spvapi.no
helm repo update
```

```bash
helm upgrade --install akv2k8s spv-charts/akv2k8s \
  --namespace akv2k8s
```

For detailed options, see the [Helm chart for akv2k8s](https://github.com/SparebankenVest/public-helm-charts/tree/master/stable/akv2k8s):

### Legacy Charts

Prior to Akv2k8s version 1.1, two Helm charts existed: `azure-key-vault-controller` and `azure-key-vault-env-injector`. These are deprecated in favor of the new `akv2k8s` chart. The old Charts used Helm 2 and the new Chart uses Helm 3. For this reason we still maintain the old charts for version 1.1, but we will not maintain future versions after 1.1. Those will only be available in the `akv2k8s` Chart.

