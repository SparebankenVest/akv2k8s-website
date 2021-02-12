---
title: "Sync Secret to ConfigMap"
description: "Sync a secret from Azure Key Vault into a Kubernetes ConfigMap"
---

> **Note: The [prerequisites](../prerequisites) are required to complete this tutorial.**

*Sync to ConfigMap feature was added in version 1.2*

We start by creating a definition for the Azure Key Vault secret
we want to sync:

```yaml:title=akvs-configmap-sync.yaml
apiVersion: spv.no/v1
kind: AzureKeyVaultSecret
metadata:
  name: secret-configmap-sync 
  namespace: akv-test
spec:
  vault:
    name: akv2k8s-test # name of key vault
    object:
      name: my-secret # name of the akv object
      type: secret # akv object type
  output: 
    configMap: 
      name: my-secret-from-akv # kubernetes configmap name
      dataKey: secret-value # key to store object value in kubernetes configmap
```

Apply to Kubernetes:

```bash
$ kubectl apply -f akvs-configmap-sync.yaml
azurekeyvaultsecret.spv.no/secret-configmap-sync created
```

List AzureKeyVaultSecret's:

```bash
$ kubectl -n akv-test get akvs
NAME                    VAULT          VAULT OBJECT   SECRET NAME         SYNCHED
secret-configmap-sync   akv2k8s-test   my-secret      my-secret-from-akv  
```

Shortly a Kubernetes ConfigMap should exist:

```bash
$ kubectl -n akv-test get configmap
NAME                DATA  AGE
my-secret-from-akv  1     1m 
```

### Cleanup

```bash
kubectl delete -f akvs-secret-sync.yaml
```