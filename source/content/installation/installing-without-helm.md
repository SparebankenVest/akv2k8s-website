---
title: "Installation without Helm"
description: "How to setup Azure Key Vault to Kubernetes"
---

Make sure to check the [requirements](requirements) before installing.

If Helm is not an option, use Helm on a local computer to generate the Kubernetes templates like below.

Add Helm repository:

```bash
helm repo add spv-charts http://charts.spvapi.no
helm repo update
```

Render chart templates locally:

```bash
helm template akv2k8s spv-charts/akv2k8s <options>
```

Or by download the Git repository:

```bash
git clone git@github.com:SparebankenVest/public-helm-charts.git
```

Render chart templates locally:

```bash
cd public-helm-charts
helm template akv2k8s ./stable/akv2k8s/ <options>
```

## Options and more

For more details about installation options, see the [Helm chart](https://github.com/SparebankenVest/public-helm-charts/tree/master/stable/akv2k8s)