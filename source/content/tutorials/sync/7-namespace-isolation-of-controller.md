---
title: "Sync with Namespace Isolation of Controller"
description: "Isolate Akv2k8s Controller to a specific namespace."
---

> **Note**: The *Installation guide* and [prerequisites](../prerequisites) are required to complete this tutorial.

> **Note**: This guide requres helm controller version >=1.3

Sometimes its necessary to isolate a Akv2k8s controller to single namespace. This is handy if you need multiple controllers isolated into different namespaces in a kubernetes cluster. This could be the case if the namespaces and keyvaults is owned by different teams/departments etc. where a singel service principal or managed identity can't have access to all of the keyvaults. Hence, custom authentication for a controller to allow fetching of AKV secrets/cert/signing-keys per namespace is desired.

## Before we start
In this tutorial we want to isolate a single controller to only sync secrets into the `akv2k8s` namespace. To do this we need to update the helm installation with the `watchAllNamespaces` option set to false, which makes the controller not watch for `AzureKeyVaultSecret` resources outside the namespace.
```bash
$ helm upgrade --install akv2k8s spv-charts/akv2k8s \
  --namespace akv2k8s --set watchAllNamespaces=false
```
In order to show how this works in practice, we will create two `AzureKeyVaultSecret`, one in the `akv2k8s` namespace, and another in the `akv-test` namespace. We expect that the controller only syncs the secret in the `akv2k8s` namespace.

## Example secrets

We start by creating a definition for the Azure Key Vault secrets in a file with name `akvs-secret-sync.yaml`:

```yaml:title=akvs-secret-sync.yaml
# Secret we want to sync:

apiVersion: spv.no/v2beta1
kind: AzureKeyVaultSecret
metadata:
  name: desired-secret
  namespace: akv2k8s
spec:
  vault:
    name: akv2k8s-test # name of key vault
    object:
      name: my-secret # name of the akv object
      type: secret # akv object type
  output:
    secret:
      name: my-secret-from-akv # kubernetes secret name
      dataKey: secret-value # key to store object value in kubernetes secret
---
# Secret we don't want to sync:

apiVersion: spv.no/v2beta1
kind: AzureKeyVaultSecret
metadata:
  name: undesired-secret
  namespace: akv-test
spec:
  vault:
    name: akv2k8s-test # name of key vault
    object:
      name: my-other-secret # name of the akv object
      type: secret # akv object type
  output:
    secret:
      name: my-other-secret-from-akv # kubernetes secret name
      dataKey: secret-value # key to store object value in kubernetes secret
```
> **NOTE**: Observe that the first `AzureKeyVaultSecret` is given to the same namespace as the controller (i.e the `akv2k8s` namespace), while the other is given to the `akv-test` namespace.

Apply to Kubernetes:

```bash
$ kubectl apply -f akvs-secret-sync.yaml
azurekeyvaultsecret.spv.no/desired-secret created
azurekeyvaultsecret.spv.no/undesired-secret created
```

List `AzureKeyVaultSecret`s:

```bash
$ kubectl get akvs --all-namespaces=true
NAMESPACE   NAME               VAULT                   VAULT OBJECT      SECRET NAME          SYNCHED
akv-test    undesired-secret   akv2k8s-test-keyvault   my-other-secret
akv2k8s     desired-secret     akv2k8s-test-keyvault   my-secret         my-secret-from-akv   2021-13-37T13:37:00Z
```
Observe that only the secret within the same namespace as the controller gets synced.

Shortly after, a Kubernetes secret should exist:

```bash
$ kubectl -n akv2k8s get secret
NAME                TYPE    DATA  AGE
my-secret-from-akv  Opaque  1     1m
```

### Cleanup

```bash
kubectl delete -f akvs-secret-sync.yaml
```