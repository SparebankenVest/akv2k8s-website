---
title: "Requirements"
description: "Requirements for installing akv2k8s"
---

* Kubernetes version >= 1.19.3
* A dedicated kubernetes namespace (e.g. akv2k8s)
* Enabled admission controllers: MutatingAdmissionWebhook and ValidatingAdmissionWebhook
* RBAC enabled
* Default [authentication](../security/authentication) requires Azure AKS - use [custom authentication](../security/authentication) if running outside Azure AKS.

## Installation requirements
The [Akv2k8s helm chart](https://github.com/SparebankenVest/public-helm-charts/tree/master/stable/akv2k8s) lets you install:
1. Controller
2. Env Injector
by setting `controller.enabled: true` and `env_injector.enabled: true` respectively.
> **Note**: You should at most have only one Env Injector installment in your cluster, because multiple instances of the Env Injector mutating webhook might compete and fail when a new pod (that needs environment injection) is created.

### Dedicated namespace for akv2k8s Env-injector's Mutating Webhook
Akv2k8s with Env Injector enabled should be installed in a dedicated Kubernetes namespace **NOT** label with `azure-key-vault-env-injection: enabled`.

**If the namespace where the akv2k8s components is installed has the injector enabled (`azure-key-vault-env-injection: enabled`), the Env Injector will most likely not be able to start.** This is because the Env Injector mutating webhook will trigger for every pod about to start in namespaces where enabled, and in the home namepsace of the Env Injector, it will effectively point to itself, which does not exist yet.

**The simple rule to avoid any issues related to this, is to just install akv2k8s components in its own dedicated namespace.**

### Installation of Multiple Controllers
> **Note**: This feature is only supported for controller >= v1.3.0.

**If you want to install multiple controllers in your cluster you need to ensure that you AT MOST have a single Env injector installment in your cluster.**

There is to ways of using multiple Akv2k8s controllers inside the same cluster:
1. Isolate controller to a single namespace using the `watchAllNamespaces=false` helm configuration.  (see [*Sync with Namespace Isolation of Controller*](../tutorials/sync/7-namespace-isolation-of-controller) tutorial).
2. Use the label filtered syncing feature (see [*Sync Objects Based on Labels*](../tutorials/sync/8-label-filtered-syncing) tutorial).

The difference between the two options, is that the first lets you isolate governance of the controller to the namespace that the controller is installed in, while the second option lets you specify what `AzureKeyVaultSecret` objects the controller should handle based on labels.

You can also use both features at the same time.

