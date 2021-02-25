---
title: "Add Exception for aad-pod-identity"
description: "Learn what needs to be done to run successfully with aad-pod-identity"
---

In order to use Managed Identities with Pods, Microsoft have developed a open source project called aad-pod-identity or Azure Active Directory Pod Identity for Kubernetes. In order for akv2k8s to run successfully in the same cluster as aad-pod-identity, a `AzurePodIdentityException` must be added for akv2k8s.

## When is `AzurePodIdentityException` required?

If all of these conditions are true, a `AzurePodIdentityException` must be added for akv2k8s to work successfully:

* The Kubernetes cluster has aad-pod-identity installed
* The Kubernetes cluster is using Managed Identity as its primary identity
* Akv2k8s is using default authentication (`keyVaultAuth=azureCloudConfig`)

## How to add the `AzurePodIdentityException`

The akv2k8s Helm chart has a simple setting for this. Just set `addAzurePodIdentityException=true` and a AzurePodIdentityException will be added to Kubernetes.

### Why?

As documented by `aad-pod-identity`:

>The authorization request to fetch a Service Principal Token from an MSI endpoint is sent to Azure Instance Metadata Service (IMDS) endpoint (169.254.169.254), **which is redirected to the NMI pod**. 

>Identity assignment on VM takes 10-20s and 40-60s in case of VMSS.

This will effectively prevent akv2k8s to do MSI authentication requests directly with the MSI endpoint (using Managed Identity with Azure Key Vault) and both the Controller and Evn Injector will fail during startup.
