---
title: "Sync PFX Certificate Stored as Secret"
description: "Sync a certificate stored as secret from Azure Key Vault into a kubernetes.io/tls Kubernetes secret."
---

> **Note**: The [prerequisites](../prerequisites) are required to complete this tutorial.

> **Note**: This guide requres helm controller version >=1.3

In some cases it is desirable to store certificates as secret in azure key vault, e.g. when using Azure's App Service Certificate service to generate certificates stored as secrets in Azure key vault. When this is the case, we need to ensure we configure our `AzureKeyVaultSecret` correctly to tell the controller to convert it to a `kubernetes.io/tls` kubernetes secret instead of a `Opaque` kubernetes secret.

## Before we start
To illustrate the syncing process of a Certificate stored as a secret in Azure Key Vault into a `kubernetes.io/tls` kubernetes secret we start by making a self-signed certificate and convert it to a PFX file. Navigate to a designated folder and run the commands:
```bash
# [Bash]
# Generate a private key (.key)
$ openssl genrsa 2048 > private-key.key

# Generate a certificate (.cert)
# You will be prompted to answer a few questions.
# You can leave them empty, and fill inn your email.
$ openssl req -new -x509 -nodes -sha256 -days 365 -key private-key.key -out certificate.cert

# Convert to PFX file (.pfx).
# Leave the export password empty!
$ openssl pkcs12 -export -out certificate.pfx -inkey private-key.key -in certificate.cert
```
> If the export password is not left empty the contorller will not be able to sync the secret.

Now we want to convert the `certificate.pfx` file into a base64 encoded string and store it as a secret in Azure Key Vault. We use two [PowerShell](https://docs.microsoft.com/en-us/powershell/) commands to convert the `.pxf` file:
```powershell
# [Powershell]
# Get content of certificate as byte stream, and convert to base64 string and store in .txt
$fileContentBytes = get-content ‘certificate.pfx' -AsByteStream
[System.Convert]::ToBase64String($fileContentBytes) | Out-File ‘pfx-encoded-bytes.txt’
```
Log into Azure and create a new Azure Key Vault secret:
```bash
# [Bash]
az keyvault secret set --vault-name akv2k8s-test --name my-pfx-cert-secret --file pfx-encoded-bytes.txt --description "application/x-pkcs12"
```
The secret needs to have the content type set to `application/x-pkcs12` to tell Azure Key Vault that it is in PKCS #12 file format.

## Example secrets
Now that the certificate is stored as a secret in Azure Key Vault, we start by creating a definition for the Azure Key Vault secret pointing to the secret we want to sync in a file called `akvs-pfx-secret-sync.yaml`:

```yaml:title=akvs-pfx-secret-sync.yaml
apiVersion: spv.no/v2beta1
kind: AzureKeyVaultSecret
metadata:
  name: pfx-secret-sync
  namespace: akv-test
spec:
  vault:
    name: akv2k8s-test # name of key vault
    object:
      name: my-pfx-cert-secret # name of the akv object
      type: secret # akv object type
  output:
    secret:
      name: my-pfx-cert-secret-from-akv # kubernetes secret name
      type: kubernetes.io/tls # kubernetes secret type
```

Apply to Kubernetes:

```bash
$ kubectl apply -f akvs-pfx-secret-sync.yaml
azurekeyvaultsecret.spv.no/pfx-secret-sync created
```

To list AzureKeyVaultSecret's and see sync status:

```bash
$ kubectl -n akv-test get akvs
NAME              VAULT                   VAULT OBJECT         SECRET NAME                   SYNCHED   AGE
pfx-secret-sync   akv2k8s-test-keyvault   my-pfx-cert-secret   my-pfx-cert-secret-from-akv   13s       37s
```

Shortly a Kubernetes secret of type `kubernetes.io/tls` should exist:

```bash
$ kubectl -n akv-test get secret
NAME                          TYPE                                  DATA   AGE
my-pfx-cert-secret-from-akv   kubernetes.io/tls                     2      10s
```

Inspect the Kubernetes secret:

```bash
kubectl -n akv-test get secret my-pfx-cert-secret-from-akv -o yaml
```

The created Kubernetes Secret should look something like this:

```yaml
apiVersion: v1
data:
  tls.crt: ...
  tls.key: ...
kind: Secret
metadata:
  name: my-pfx-cert-secret-from-akv
  namespace: akv-test
type: kubernetes.io/tls
```

### Cleanup

```bash
kubectl delete -f akvs-pfx-secret-sync.yaml
```