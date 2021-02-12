---
title: "Sync Multiple Secrets"
description: "Sync multiple AzureKeyVaultSecrets to a single Kubernetes Secret"
---

> **Note: The [prerequisites](../prerequisites) are required to complete this tutorial.**

*Sync from multiple AzureKeyVaultSecrets to one Secret or ConfigMap was added in version 1.2*

We start by creating two definitions of the Azure Key Vault secrets
we want to sync:

```yaml:title=multi-akvs-secret-sync.yaml
apiVersion: spv.no/v1
kind: AzureKeyVaultSecret
metadata:
  name: secret-sync-1
  namespace: akv-test
spec:
  vault:
    name: akv2k8s-test # name of key vault
    object:
      name: my-secret # name of the akv object
      type: secret # akv object type
  output: 
    secret: 
      name: my-secrets-from-akv # kubernetes secret name
      dataKey: secret-value-1 # key to store object value in kubernetes secret
---
apiVersion: spv.no/v1
kind: AzureKeyVaultSecret
metadata:
  name: secret-sync-2
  namespace: akv-test
spec:
  vault:
    name: akv2k8s-test # name of key vault
    object:
      name: my-other-secret # name of the akv object
      type: secret # akv object type
  output: 
    secret: 
      name: my-secrets-from-akv # kubernetes secret name
      dataKey: secret-value-2 # key to store object value in kubernetes secret
```

Apply to Kubernetes:

```bash
$ kubectl apply -f multi-akvs-secret-sync.yaml
azurekeyvaultsecret.spv.no/secret-sync-1 created
azurekeyvaultsecret.spv.no/secret-sync-2 created
```

List AzureKeyVaultSecret's:

```bash
$ kubectl -n akv-test get akvs
NAME            VAULT          VAULT OBJECT   SECRET NAME         SYNCHED
secret-sync-1   akv2k8s-test   my-secret      my-secrets-from-akv  
secret-sync-2   akv2k8s-test   my-secret      my-secrets-from-akv  
```

Shortly a Kubernetes secret should exist:

```bash
$ kubectl -n akv-test get secret
NAME                 TYPE    DATA  AGE
my-secrets-from-akv  Opaque  1     1m 
```

Inspect secret to see it contains both akvs values:

```bash
$ kubectl -n akv-test get secret my-secrets-from-akv -o yaml
```

### Cleanup

```bash
kubectl delete -f akvs-secret-sync.yaml
```