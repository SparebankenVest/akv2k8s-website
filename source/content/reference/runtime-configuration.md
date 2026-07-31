---
title: "Runtime configuration"
description: "Runtime flags and environment variables supported by akv2k8s 1.5"
---

Most installations configure akv2k8s through the Helm chart. The options below are component runtime flags or environment variables that were relevant for the 1.5 release.

## Controller

| Option | Default | Description |
| ------ | ------- | ----------- |
| `--watch-all-namespaces` | `true` | Watch `AzureKeyVaultSecret` resources in all namespaces. Set to `false` to watch only the controller runtime namespace. |
| `--kube-resync-period` | `30` | Kubernetes informer resync period in seconds. |
| `--azure-resync-period` | `30` | Azure Key Vault resync period in seconds. |
| `AUTH_TYPE` | `azureCloudConfig` | Key Vault authentication mode. Supported values include `azureCloudConfig`, `environment`, and `environment-azidentity`. |
| `OBJECT_LABELS` | empty | Label selector used to make a controller handle only matching `AzureKeyVaultSecret` objects. |
| `METRICS_ENABLED` | `false` | Enables the controller `/metrics` endpoint. |
| `HTTP_PORT` | `9000` | Port for the controller HTTP server. `/healthz` is served even when metrics are disabled. |

## Env-Injector Webhook

| Option | Default | Description |
| ------ | ------- | ----------- |
| `AUTH_TYPE` | `cloudConfig` | Key Vault authentication mode. Supported values include `azureCloudConfig`, `environment`, and `environment-azidentity`. |
| `USE_AUTH_SERVICE` | `true` | Enables the auth service used by injected application containers. |
| `METRICS_ENABLED` | `false` | Enables webhook metrics. |
| `AZUREKEYVAULT_ENV_IMAGE` | `spvest/azure-keyvault-env:latest` | Image used by the init container that copies the env executable. |
| `WEBHOOK_CONTAINER_IMAGE_PULL_POLICY` | `IfNotPresent` | Pull policy for the env executable init container. |

## Env Lookup Syntax

The Env-Injector accepts AzureKeyVaultSecret references in environment variable values using this form:

```bash
<azure-key-vault-secret-name>@azurekeyvault
<azure-key-vault-secret-name>@azurekeyvault?<query>
```

In 1.5, the lookup parser accepts RFC 1123-style AzureKeyVaultSecret names and query names containing dots.
