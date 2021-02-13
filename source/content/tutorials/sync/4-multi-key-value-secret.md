---
title: "Sync Multi Key Value Secret"
description: "Sync a multi-key-value secret from Azure Key Vault into a Kubernetes Secret"
---

> **Note: The [prerequisites](../prerequisites) are required to complete this tutorial.**

Sometimes its necessary to have Kubernetes `Secret`'s with multiple keys and values. The problem
is that Secrets in Azure Key Vault has no concept of keys or values. Because of this akv2k8s
have introduced a new type called `multi-key-value-secret`
(see [AzureKeyVaultSecret Object Types](/reference/azure-key-vault-secret/#vault-object-types)).

## Example secret 

`Prerequisite` You need to have a secret in your Azure Key Vault with a json / yaml as value. Example values:

```yaml
key1: value1
key2: value2
key3: value3
```

or

```json
{
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
```
To sync your Azure Key Vault with the cluster create a AzureKeyVaultSecret with output:

```yaml
apiVersion: spv.no/v2beta1
kind: AzureKeyVaultSecret
metadata:
  name: db-config
spec:
  vault:
    name: your-key-vault
    object:
      contentType: application/x-json # make sure this matches the content of the secret, can be either 'application/x-json' or 'application/x-yaml'
      name: db-config
      type: multi-key-value-secret
  output:
    secret:
      name: db-config
```
The resulting secret in the cluster will look like this: 
```yaml
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: db-config
data:
  key1: dmFsdWUx
  key2: dmFsdWUy
  key3: dmFsdWUz
```
