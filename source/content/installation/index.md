---
title: "Overview"
description: "Different options for installing akv2k8s"
---

Make sure to check the [requirements](requirements) before installing. 

## Installation options

* If running on Azure AKS, see [Installing on Azure AKS](on-azure-aks)
* If running outside Azure AKS, see [Installing outside Azure AKS](outside-azure-aks)

In addition, if the Kubernetes cluster has [Azure Active Directory Pod Identity for Kubernetes (aad-pod-identity)](https://github.com/Azure/aad-pod-identity) installed, check out if a [`AzurePodIdentityException` is required for akv2k8s to authenticate successfully with Azure](with-aad-pod-identity).

Akv2k8s rely heavily on Helm to configure its Kubernetes resources during installation. If Helm is not an option, see [Installing without Helm](without-helm).
