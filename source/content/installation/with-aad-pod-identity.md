---
title: "Add Exception for aad-pod-identity"
description: "Learn what needs to be done to run successfully with aad-pod-identity"
---

In order to use Managed Identities with Pods, Microsoft have developed a open source project called aad-pod-identity or Azure Active Directory Pod Identity for Kubernetes. There is three possible configurations that lets you run akv2k8s successfully in the same cluster as aad-pod-identity. They depend on the [authentication method against Azure Key Vault](../security/authentication.md) you choose for akv2k8s in your cluster.
1. When using `keyVaultAuth=azureCloudConfig`, i.e. let akv2k8s use the default AKS managed identity, you need to configure akv2k8s with `addAzurePodIdentityException=true` upon installation.
2. When using `keyVaultAuth=environment` together with `env_injector.podLabels.aadpodidbinding=<AzureIdentityBinding selector>` and `controller.podLabels.aadpodidbinding=<AzureIdentityBinding selector>`, i.e. let akv2k8s use a user defined managed identity. This makes the akv2k8s pods use the AAD pod-managed identity corresponding to the pod label. `addAzurePodIdentityExeption` is false in this case.
3. When using `env_injector.authService=false` together with either option 1 or 2. This is effectively configures akv2k8s not to use the key vault auth service provided by the env injector together with one of the options above.
> **NB**: Some user reports problems with option 3 when pulling images from private image repositories.


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

## Env injection for pods pulling private image repositories
When an application pod uses images from a private image repository and wants to use env-injection it is important that the Managed indentity used by the akv2k8s mutating webhook pods (env-injector)
1. has `AcrPull` access to the image repository
2. has Get access for the correct objects in the desired Key Vault.
> Note: requirement 2 is not the case if akv2k8s is configured with `env_injector.authService=false`, i.e. env-injector key-vault auth service disabled.

This is because (1) the env injector mutates the container image before the pods starts (and hence needs access to the image repository) and (2) the mutated container will ask the env-injector pods for the Key Vault authentication credentials before the secret injection happens. In other words, the application pod do not care if the applications AAD pod-managed identity have access to the key vault, since it is using the credentials given from the env-injector.