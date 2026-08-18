---
title: "Authentication with Azure Key Vault"
description: "Learn about the different options for authenticating with Azure Key Vault."
---

By default both the Controller and the Env Injector will assume it is running on Azure (since Azure Key Vault is most commonly used in Azure) - and use the default AKS credentials for authentication (a Service Principal or Azure Managed Identities) - unless custom authentication is provided.

For new AKS clusters, Azure Workload Identity is the recommended custom identity integration. See [Installing with Azure Workload Identity](../installation/with-azure-workload-identity) for setup instructions.

The Controller and Env-Injector have to handle AKV authentication quite differently, as the Controller is centralized and the Env-Injector executes in context of Pods.

For more details about AKV authentication, see:
  * [AKV Authentication with the Controller](#akv-authentication-with-the-controller) for AKV Controller authentication options
  * [AKV Authentication with the Env-Injector](#akv-authentication-with-the-env-injector) for AKV Env-Injector authentication options

## AKV Authentication with the Controller

The Controller will need AKV credentials to get Secrets from AKV and store them as Kubernetes Secrets or Config Maps. **If the default option (AKS credentials) works for you, use that.** If not, use custom authentication by setting `controller.keyVaultAuth` to `environment` or `environment-azidentity` and pick one of the [Authentication options](#custom-akv-authentication-options) described below.

For more details, see the [akv2k8s Helm chart](https://github.com/SparebankenVest/public-helm-charts/tree/master/stable/akv2k8s/README.md).

## AKV Authentication with the Env-Injector

The Env-Injector execute locally inside Pods and needs AKV credentials to download and inject secrets into container programs. You can either use default authentication (AKS credentials) or custom authentication. The Env-Injector also needs to access the registry where the container image is stored (ACR for example), thus make sure you provide authentication which has read rights to your registry.

Use the following decision tree to find the best option:

![Authentication decision tree](https://embed.creately.com/9XlkIhybc1S?type=svg)

> **For multi-tenant environments (using namespaces as isolation), disabling the Auth Service and pass AKV credentials to each Pod is currently the only viable option.**

Fore more details, see the [Helm Chart](https://github.com/SparebankenVest/public-helm-charts/tree/master/stable/akv2k8s/README.md) and which custom AKV authentication options are available below.

### Using Azure Workload Identity

Set the Key Vault auth mode to `environment-azidentity` to make akv2k8s use Azure SDK `DefaultAzureCredential`.

```yaml
global:
  keyVaultAuth: environment-azidentity
```

When used with Azure Workload Identity, the workload identity webhook injects the environment variables and token file required by `DefaultAzureCredential`. See [Installing with Azure Workload Identity](../installation/with-azure-workload-identity) for the required labels, service account annotations, and federated credentials.

## Custom AKV Authentication Options

The following authentication options are available:

| Authentication type |	Environment variable         | Description |
| ------------------- | ---------------------------- | ------------ |
| Azure SDK DefaultAzureCredential | `AZURE_CLIENT_ID` | Used by `environment-azidentity`, including Azure Workload Identity. Other environment variables are injected by Azure Workload Identity or configured according to Azure SDK credential support. |
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

See the [Azure SDK for Go authentication overview](https://learn.microsoft.com/en-us/azure/developer/go/sdk/authentication/authentication-overview) for environment-based authentication details.
