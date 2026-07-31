---
title: "Supply chain verification"
description: "Verify akv2k8s release images, attestations, and SBOMs"
---

akv2k8s release workflows publish container images with GitHub artifact attestations and SBOM assets. Use these artifacts to verify that an image was produced by the akv2k8s release workflow before deploying it.

## Verify Image Attestations

Use the GitHub CLI to verify a released image attestation:

```bash
gh attestation verify \
  "oci://docker.io/spvest/azure-keyvault-webhook:1.8.4" \
  --repo "SparebankenVest/azure-key-vault-to-kubernetes" \
  --signer-workflow "SparebankenVest/azure-key-vault-to-kubernetes/.github/workflows/webhook-release.yaml" \
  --source-ref "refs/tags/webhook-1.8.4"
```

Use the matching workflow and tag for each component:

| Component | Image | Release workflow | Tag format |
| --------- | ----- | ---------------- | ---------- |
| Controller | `spvest/azure-keyvault-controller` | `controller-release.yaml` | `controller-<version>` |
| Webhook | `spvest/azure-keyvault-webhook` | `webhook-release.yaml` | `webhook-<version>` |
| Env executable | `spvest/azure-keyvault-env` | `vaultenv-release.yaml` | `vaultenv-<version>` |

Add `--format json` to inspect the verified statement, image digest, and workflow identity.

## Download Attestation Bundles

For offline verification workflows, download the attestation bundle:

```bash
gh attestation download \
  "oci://docker.io/spvest/azure-keyvault-webhook:1.8.4" \
  --repo "SparebankenVest/azure-key-vault-to-kubernetes"
```

## SBOM Assets

Component GitHub Releases include SPDX SBOM assets for published platform images. Download the SBOM from the release page for the component tag you deploy, for example `webhook-1.8.4`, `controller-1.8.4`, or `vaultenv-1.8.4`.
