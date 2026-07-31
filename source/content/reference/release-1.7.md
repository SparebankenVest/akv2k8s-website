---
title: "Akv2k8s 1.7"
description: "Release notes and deployment-relevant changes for akv2k8s 1.7"
---

Akv2k8s 1.7 is primarily a build, release, and dependency update release. It does not introduce new `AzureKeyVaultSecret` fields or change the documented runtime configuration from 1.6.

## Multi-Architecture Images

Starting with the 1.7 release series, akv2k8s container images are built for both `linux/amd64` and `linux/arm64`.

The supported component images are:

| Component | Image |
| --------- | ----- |
| Controller | `spvest/azure-keyvault-controller` |
| Env-Injector webhook | `spvest/azure-keyvault-webhook` |
| Env executable | `spvest/azure-keyvault-env` |

Use the normal image tags for the release, for example `1.7.4`. Container runtimes will pull the matching image variant for the node architecture.

## Security and Dependency Updates

The 1.7 release series also includes dependency and base image updates, including security fixes. Review the component image tags you deploy and upgrade all three components together unless you have a specific reason to pin them independently.

## Upgrade Notes

No Kubernetes custom resource migration is required when upgrading from 1.6 to 1.7. Existing `AzureKeyVaultSecret` resources using `apiVersion: spv.no/v2beta1` continue to be supported.
