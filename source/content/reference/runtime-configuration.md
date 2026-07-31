---
title: "Runtime configuration"
description: "Runtime flags and environment variables supported by akv2k8s components"
---

Most installations configure akv2k8s through the Helm chart. The options below are component runtime flags or environment variables that may be useful when troubleshooting or when mapping Helm values to the running pods.

## Controller

| Option | Default | Description |
| ------ | ------- | ----------- |
| `--watch-all-namespaces` | `true` | Watch `AzureKeyVaultSecret` resources in all namespaces. Set to `false` to watch only the controller runtime namespace. |
| `--kube-resync-period` | `30` | Kubernetes informer resync period in seconds. |
| `--azure-resync-period` | `30` | Azure Key Vault resync period in seconds. |
| `AUTH_TYPE` | `azureCloudConfig` | Key Vault authentication mode. Supported values include `azureCloudConfig`, `environment`, and `environment-azidentity`. |
| `OBJECT_LABELS` | empty | Label selector used to make a controller handle only matching `AzureKeyVaultSecret` objects. |
| `METRICS_ENABLED` | `false` | Enables the controller `/metrics` endpoint. |
| `HTTP_PORT` | `9000` | Port for health and metrics endpoints. |

## Env-Injector Webhook

| Option | Default | Description |
| ------ | ------- | ----------- |
| `AUTH_TYPE` | `cloudConfig` | Key Vault authentication mode. Supported values include `azureCloudConfig`, `environment`, and `environment-azidentity`. |
| `USE_AUTH_SERVICE` | `true` | Enables the auth service used by injected application containers. |
| `METRICS_ENABLED` | `false` | Enables webhook metrics. |
| `AZUREKEYVAULT_ENV_IMAGE` | `spvest/azure-keyvault-env:latest` | Image used by the init container that copies the env executable. |
| `WEBHOOK_CONTAINER_IMAGE_PULL_POLICY` | `IfNotPresent` | Pull policy for the env executable init container. |
| `WEBHOOK_INIT_CONTAINER_REQUESTS_CPU` | `5m` | CPU request for the env executable init container. |
| `WEBHOOK_INIT_CONTAINER_REQUESTS_MEMORY` | `32Mi` | Memory request for the env executable init container. |
| `WEBHOOK_INIT_CONTAINER_LIMITS_MEMORY` | `32Mi` | Memory limit for the env executable init container. |
| `WEBHOOK_CONTAINER_SECURITY_CONTEXT_READ_ONLY` | `false` | Sets `readOnlyRootFilesystem` on the env executable init container. |
| `WEBHOOK_CONTAINER_SECURITY_CONTEXT_NON_ROOT` | `false` | Sets `runAsNonRoot` on the env executable init container. |
| `WEBHOOK_CONTAINER_SECURITY_CONTEXT_PRIVILEGED` | `true` | Sets `privileged` on the env executable init container. |
| `WEBHOOK_CONTAINER_SECURITY_CONTEXT_ALLOW_PRIVILEGE_ESCALATION` | unset | Sets `allowPrivilegeEscalation` on the env executable init container when provided. |
| `WEBHOOK_CONTAINER_SECURITY_CONTEXT_USER_UID` | unset | Sets `runAsUser` on the env executable init container when provided. |
| `WEBHOOK_CONTAINER_SECURITY_CONTEXT_GROUP_GID` | unset | Sets `runAsGroup` on the env executable init container when provided. |
| `WEBHOOK_CONTAINER_SECURITY_CONTEXT_SECCOMP_RUNTIME_DEFAULT` | unset | Sets a `RuntimeDefault` seccomp profile on the env executable init container when `true`. |

## Injected Application Containers

| Option | Default | Description |
| ------ | ------- | ----------- |
| `ENV_INJECTOR_DISABLE_AUTH_SERVICE` | `false` | Set to `true` on a specific application container to disable auth service use for that container only. |
| `ENV_INJECTOR_LOG_LEVEL` | `info` | Log level for the env executable running inside the application container. |
| `ENV_INJECTOR_LOG_FORMAT` | `fmt` | Log format for the env executable. |
| `ENV_INJECTOR_RETRIES` | `3` | Number of retry attempts when fetching secrets. |
| `ENV_INJECTOR_WAIT_BEFORE_RETRY` | `3` | Seconds to wait between retry attempts. |

`ENV_INJECTOR_DISABLE_AUTH_SERVICE` is useful when the Env-Injector auth service is enabled globally, but one workload should authenticate directly with its own Azure identity or environment-based credentials.
