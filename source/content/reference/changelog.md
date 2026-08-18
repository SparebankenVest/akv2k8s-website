---
title: "Changelog"
description: "Functional changes in akv2k8s releases"
---

# Changelog

This page records the user-visible changes in akv2k8s releases. The current
release line is `1.8.x`, with component releases `controller-1.8.4`,
`webhook-1.8.4`, and `vaultenv-1.8.4`.

Dependency-only, base-image, and CI-only changes are omitted unless they affect
installation or supported platforms. Use the current installation and reference
pages when deploying 1.8; older entries are release history, not configuration
guidance.

## 1.8

### 1.8.4

- The Env Injector's injected init container has default resource requests of
  `5m` CPU and `32Mi` memory, plus a `32Mi` memory limit. Configure them with
  `WEBHOOK_INIT_CONTAINER_REQUESTS_CPU`,
  `WEBHOOK_INIT_CONTAINER_REQUESTS_MEMORY`, and
  `WEBHOOK_INIT_CONTAINER_LIMITS_MEMORY`.

### 1.8.0

- `AZURE_ENVIRONMENT` configures the Azure Key Vault token scope and DNS suffix.
  This adds first-class Azure US Government Cloud support, including the
  `vault.usgovcloudapi.net` suffix.

## 1.7

### 1.7.0

- Published Controller, Env Injector webhook, and `azure-keyvault-env` images
  for `linux/amd64` and `linux/arm64`.
- Added initial integration-test manifests and Apple Silicon build/test support.

## 1.6

### 1.6.0

- The Env Injector uses Azure service-principal credentials from cloud config to
  inspect private ACR images when `AUTH_TYPE=azureCloudConfig`.
- Added injected init-container security-context controls for privilege
  escalation and RuntimeDefault seccomp.
- The webhook no longer changes the workload Pod-level `securityContext`; it
  configures only its injected init container.
- Expanded accepted injected secret reference names to RFC-1123 DNS-label names
  of up to 253 characters.
- JSON logs write informational messages to stdout and errors to stderr.
- The Controller emits `Synced` events only when its target Secret or ConfigMap
  changes.

## 1.5

### 1.5.0

- Added Azure Workload Identity through
  `AUTH_TYPE=environment-azidentity`, which uses Azure SDK
  `DefaultAzureCredential`.
- Renamed the webhook cloud-config authentication value to
  `azureCloudConfig`; `cloudConfig` remains accepted for compatibility.
- Added `WEBHOOK_CONTAINER_IMAGE_PULL_POLICY` for the injected init-container
  image pull policy.
- Added initial security-context settings for the injected init container.
  Pod-level mutation introduced in this release was removed in 1.6.
- Controller `/healthz` is always available, independent of metrics. The
  `metrics_port` environment variable was renamed to `http_port`.
- Added configurable Key Vault DNS suffix support and failure counters for Key
  Vault/controller sync failures.
- Fixed `OBJECT_LABELS` filtering so it applies only to
  `AzureKeyVaultSecret` informers.

## 1.4

### 1.4.1

- The Env Injector creates or updates the authentication-service Secret once per
  Pod mutation instead of once per container.
- Fixed label-selector handling that could cause `secret not found` errors.

## 1.3

### 1.3.1

- The Env Injector falls back to a generated Pod name when creating a Secret for
  an unnamed Pod.
- Refined validation of injectable secret references.
- Fixed namespaced-controller RBAC when `watchAllNamespaces=false`.

### 1.3.0

- Added namespace-scoped Controller operation with `watchAllNamespaces=false`.
- Added label-filtered controller handling for distinct authorization policies.
- Began generating CRDs from code.
- Added support for exporting a Base64 PFX certificate stored as a Key Vault
  Secret to a Kubernetes TLS Secret.

## 1.2

### 1.2.2 and 1.2.1

- Fixed authentication-service endpoint creation ordering and injected Pod name
  and namespace values when the auth service is disabled.
- Added Env Injector log level and format environment-variable handling.

### 1.2.0

- Added Controller output to ConfigMaps in addition to Kubernetes Secrets.
- Allowed multiple `AzureKeyVaultSecret` resources to write distinct `dataKey`
  values to one Secret or ConfigMap.
- Secured Env Injector authentication-service credential exchange with mTLS.
- Added optional Prometheus metrics to both components.
- Standardized Helm chart values and added global, ServiceMonitor, and extra
  volume configuration.

## 1.1

### 1.1.1

- Reworked Env Injector Azure Key Vault authentication and introduced the
  centralized authentication service.
- Introduced the unified Helm 3 `akv2k8s` chart containing both Controller and
  Env Injector.
- Added Azure Managed Identity support, `fmt` and JSON log formats, and
  non-public Azure cloud support.
- Moved the `AzureKeyVaultSecret` CRD from `spv.no/v1alpha1` to `spv.no/v1`
  while retaining backward compatibility.
- Added remote image inspection, SHA image notation, and certificate chain
  ordering with `chainOrder`.

## 1.0

### 1.0.2

- Removed Env Injector sensitive-file deletion after it prevented crashed Pods
  from recovering. Do not rely on sensitive-file deletion behavior.

### 1.0.0

- Added Env Injector logging, Prometheus metrics, retry behavior, and raw
  certificate access.
- Added Controller and Env Injector support for Azure public, China, Germany,
  and US Government clouds.
- Added configurable Controller cloud-config path and Env Injector custom
  authentication.
