---
title: "Authentication with Azure Key Vault"
description: "Learn about the different options for authenticating with Azure Key Vault."
---

By default both the Controller and the Env Injector will assume it is running on Azure (since Azure Key Vault is most commonly used in Azure) - and use the default AKS credentials for authentication (a Service Principal or Azure Managed Identities) - unless custom authentication is provided.

The Controller and Env-Injector have to handle AKV authentication quite differently, as the Controller is centralized and the Env-Injector executes in context of Pods.

For more details about AKV authentication, see:
  * [AKV Authentication with the Controller](#akv-authentication-with-the-controller) for AKV Controller authentication options
  * [AKV Authentication with the Env-Injector](#akv-authentication-with-the-env-injector) for AKV Env-Injector authentication options

## Situations where Default Authentication does not Work

Currently only one situation has been identified, where default authentication does not work inside Azure.

**When a [Pod Security Policy](https://kubernetes.io/docs/concepts/policy/pod-security-policy/) is configured in the cluster, preventing containers from reading from the host.**

Two solutions exists:  
  1. Change the Pod Security Policy to list `/etc/kubernetes/azure.json` under [AllowedHostPaths](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#volumes-and-file-systems) 
  2. Or use custom authentication (see below). 

## AKV Authentication with the Controller

The Controller will need AKV credentials to get Secrets from AKV and store them as Kubernetes Secrets or Config Maps. **If the default option (AKS credentials) works for you, use that.** If not, use custom authentication by passing inn the value `controller.keyVaultAuth=environment` to the Controller and pick one of the [Authentication options](#custom-akv-authentication-options) described below.

Fore more details, see the [Controller Helm Chart](https://github.com/SparebankenVest/public-helm-charts/tree/master/stable/azure-key-vault-controller/README.md).

## AKV Authentication with the Env-Injector

The Env-Injector execute locally inside Pods and needs AKV credentials to download and inject secrets into container programs. You can either use default authentication (AKS credentials) or custom authentication. The Env-Injector also needs to access the registry where the container image is stored (ACR for example), thus make sure you provide authentication which has read rights to your registry.

Use the following decision tree to find the best option:

![Authentication decision tree](https://embed.creately.com/9XlkIhybc1S?type=svg)

> **For multi-tenant environments (using namespaces as isolation), disabling the Auth Service and pass AKV credentials to each Pod is currently the only viable option.**

Fore more details, see the [Helm Chart](https://github.com/SparebankenVest/public-helm-charts/tree/master/stable/akv2k8s/README.md) and which custom AKV authentication options are available below.

### Using aad-pod-identity and MSI (System Assigned Managed Identity or User Assigned Managed Identity)

If `aad-pod-identity` is installed in a cluster with MSI and akv2k8s, akv2k8s will not work out of the box, as documented by `aad-pod-identity`:

>The authorization request to fetch a Service Principal Token from an MSI endpoint is sent to Azure Instance Metadata Service (IMDS) endpoint (169.254.169.254), which is redirected to the NMI pod. 

>Identity assignment on VM takes 10-20s and 40-60s in case of VMSS.

See [Add Exception for aad-pod-identity](../installation/with-aad-pod-identity) for how to add a `AzurePodIdentityException` and have akv2k8s use MSI without interference of aad-pod-identity.

### Using custom authentication with AAD Pod Identity (aad-pod-identity)

First follow the [authentication decision tree](#akv-authentication-with-the-env-injector) above.

#### Option 1 (keyVaultAuth=environment) - pass aad-pod-identity to the env-injector

When installing the env-injector using the official [`akv2k8s`](https://github.com/SparebankenVest/public-helm-charts/tree/master/stable/akv2k8s) Helm chart, set the following values:

```
--set env_injector.keyVaultAuth=environment
--set env_injector.podLabels.aadpodidbinding=[your aad identity]
```

#### Option 2 (authService=false) - pass aad-pod-identity to every application pod

First tell Env Injector not to use the Auth Service:

```
--set env_injector.authService=false
```

Then for every Pod pass on credentials using aad-pod-identity as you would with any other Pod. 

## Custom AKV Authentication Options

The following authentication options are available:

| Authentication type |	Environment variable         | Description |
| ------------------- | ---------------------------- | ------------ |
| Managed identities for Azure resources (used to be MSI) | | No credentials are needed for managed identity authentication. The Kubernetes cluster must be running in Azure and the `aad-pod-identity` controller must be installed. A `AzureIdentity` and `AzureIdentityBinding` must be defined. See https://github.com/Azure/aad-pod-identity for details. |
| Client credentials 	| `AZURE_TENANT_ID` 	         | The ID for the Active Directory tenant that the service principal belongs to. |
|                     |	`AZURE_CLIENT_ID` 	         | The name or ID of the service principal. |
|                     |	`AZURE_CLIENT_SECRET`        | The secret associated with the service principal. |
| Certificate 	      | `AZURE_TENANT_ID`            | The ID for the Active Directory tenant that the certificate is registered with. |
|                     | `AZURE_CLIENT_ID`            | The application client ID associated with the certificate. |
|                     | `AZURE_CERTIFICATE_PATH`     | The path to the client certificate file. |
|                     | `AZURE_CERTIFICATE_PASSWORD` | The password for the client certificate. |
| Username/Password   | `AZURE_TENANT_ID`            | The ID for the Active Directory tenant that the user belongs to. |
|                     | `AZURE_CLIENT_ID`            | The application client ID. |
|                     | `AZURE_USERNAME`             | The username to sign in with.
|                     | `AZURE_PASSWORD`             | The password to sign in with. |

**Note: These env variables are sensitive and should be stored in a Kubernetes `Secret` resource, then referenced by [Using Secrets as Environment Variables](https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-environment-variables).** 

See official MS documentation for more details on how environment base authentication works for Azure: https://docs.microsoft.com/en-us/go/azure/azure-sdk-go-authorization#use-environment-based-authentication
