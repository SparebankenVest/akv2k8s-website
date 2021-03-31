---
title: "Updating akv2k8s CRDs"
description: "How to update akv2k8s Custom Resource Definitions (CRDs)"
---

On first install, the Helm Chart will add the `AzureKeyVaultSecret` CRD to Kubernetes if it does not already exists. On later upgrades or if it already exists, any changed to the CRD will not be updated by the Helm Chart. For Helm this is [by design](https://helm.sh/docs/chart_best_practices/custom_resource_definitions/#method-1-let-helm-do-it-for-you).

> NOTE: When upgrading Azure Key Vault to Kubernetes, manually apply CRDs before upgrade. Latest CRDs will always be available at https://github.com/SparebankenVest/azure-key-vault-to-kubernetes/tree/master/crds and can be installed manually by:**
>
> ```
> kubectl apply -f https://raw.githubusercontent.com/sparebankenvest/azure-key-vault-to-kubernetes/master/crds/AzureKeyVaultSecret.yaml
> ```

In versions `<= 1.2` of akv2k8s only the `AzureKeyVaultSecret` CRD is needed.

> NOTE: If you delete the `AzureKeyVaultSecret` CRD from Kubernetes, all resources of type `AzureKeyVaultSecret` created in cluster will be removed. This is by design: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#delete-a-customresourcedefinition
