---
title: "Upgrade"
description: "How to upgrade Azure Key Vault to Kubernetes"
---

> Make sure to check the [requirements](requirements) before installing.

Upgrading akv2k8s is exactly the same as installing, with two exceptions:

* The crd (Custom Resource Definition) will not be upgraded by Helm and must be applied using `kubectl` (see https://helm.sh/docs/chart_best_practices/custom_resource_definitions/#method-1-let-helm-do-it-for-you)
* Pods having env variables injected by Env Injector AND using centralized authentication (akv2k8s Auth Service) (which is default), must be killed to avoid pod failures if crashed

## Upgrading

Update helm chart:

```bash
helm repo update
```

Run the Helm upgrade:

```bash
helm upgrade --install akv2k8s spv-charts/akv2k8s \
  --namespace akv2k8s
```

## Manually upgrading Custom Resource Definition (CRD)

Latest CRDs are always be available at https://github.com/SparebankenVest/azure-key-vault-to-kubernetes/tree/master/crds and can be installed manually by:

```
kubectl apply -f https://raw.githubusercontent.com/SparebankenVest/azure-key-vault-to-kubernetes/master/crds/AzureKeyVaultSecret.yaml
```

>Note: If you delete the `AzureKeyVaultSecret` CRD from Kubernetes, all resources of type `AzureKeyVaultSecret` created in cluster will be removed. This is by design: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#delete-a-customresourcedefinition


## Re-deploy Existing Pods with Env Injected Variables

Version 1.2 of the Env Injector has changed how the Auth Service works. It now requires a client certificate and older versions of the Env Injector Sidecar does not work with version 1.2.

## Upgrading Helm chart version to v2.x.x from v1.1.x

As a consequence of breaking changes in the akv2k8s Helm chart a major version bump to 2.x.x was required.
Uninstallation of v1.1.x is required before installing v2.x.x.

```
helm uninstall akv2k8s -n akv2k8s
```

>Note: Remember to upgrade the CRD manually if an old CRD version is applied to the cluster, as Helm does not handle CRD upgrades.
