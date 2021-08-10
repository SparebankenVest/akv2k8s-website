---
title: "Sync Objects Based on Labels"
description: "How to sync objects based on label selectors"
---

> **Note**: The *Installation guide* and [prerequisites](../prerequisites) are required to complete this tutorial.

> **Note**: This guide requres helm controller version >=1.3

Sometimes it is desired to only sync objects that are labeled in a certain way. I.e. If we run multiple controllers in the cluster and want the different controllers to handle syncing of specific objects.

## Before we start
In this tutorial we will deploy a single controller in the `akv2k8s` namespace and force it to only look for `AzureKeyVaultSecret` objects with a specific label. To do this we need to upgrade the helm installation like this:
```bash
$ helm upgrade --install akv2k8s spv-charts/akv2k8s \
  --namespace akv2k8s --set controller.env.OBJECT_LABELS="someSecretLabel=someSecretValue"
```
By passing an environment variable called `OBJECT_LABELS` with the value `"someSecretLabel=SomeSecretValue"` the controller will understand that it should be looking for `AzureKeyVaultSecret`s with label `someSecretLabel: someSecretValue`.

> **Info**: The environment variable is stored in a kubernetes secret called `akv-<CONTROLLER_NAME>-akv2k8s-controller-env` with key `OBJECT_LABEL` and value `"someSecretLabel=someSecretValue"`.

## Example secrets

We start by creating a definition for the Azure Key Vault secrets in a file with name `akvs-secret-sync.yaml`:

```yaml:title=akvs-secret-sync.yaml
# Secret we want to sync:

apiVersion: spv.no/v2beta1
kind: AzureKeyVaultSecret
metadata:
  name: desired-secret
  namespace: akv-test
  labels:
    someSecretLabel: someSecretValue # Label that controller is configured to select
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
# Secret without label that we don't want to sync:

apiVersion: spv.no/v2beta1
kind: AzureKeyVaultSecret
metadata:
  name: undesired-secret-1
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
---
# Secret with label that we don't want to sync

apiVersion: spv.no/v2beta1
kind: AzureKeyVaultSecret
metadata:
  name: undesired-secret-2
  namespace: akv-test
  labels:
    notThatSecretLabel: notThatSecretValue
spec:
  vault:
    name: akv2k8s-test # name of key vault
    object:
      name: my-other-secret # name of the akv object
      type: secret # akv object type
  output:
    secret:
      name: my-other-secret-with-label-from-akv # kubernetes secret name
      dataKey: secret-value # key to store object value in kubernetes secret
```
Notice that the first secret is the one we want to sync, hence it got the label that the controller will recognize. The two other secrets either don't have a label at all or a label that the controller do not care about.

Apply to Kubernetes:

```bash
$ kubectl apply -f akvs-secret-sync.yaml
azurekeyvaultsecret.spv.no/desired-secret created
azurekeyvaultsecret.spv.no/undesired-secret-1 created
azurekeyvaultsecret.spv.no/undesired-secret-2 created
```

List `AzureKeyVaultSecret`s:

```bash
$ kubectl get akvs --all-namespaces=true
NAMESPACE   NAME                 VAULT                   VAULT OBJECT      SECRET NAME          SYNCHED
akv-test    desired-secret       akv2k8s-test-keyvault   my-secret         my-secret-from-akv   2021-13-37T13:37:00Z
akv-test    undesired-secret-1   akv2k8s-test-keyvault   my-other-secret
akv-test    undesired-secret-2   akv2k8s-test-keyvault   my-other-secret
```
Observe that only the secret with the label `someSecretLabel: SomeSecretValue` gets synced

Shortly after, a Kubernetes secret should exist:

```bash
$ kubectl -n akv-test get secret
NAME                TYPE    DATA  AGE
my-secret-from-akv  Opaque  1     1m
```

### Cleanup

```bash
kubectl delete -f akvs-secret-sync.yaml
```