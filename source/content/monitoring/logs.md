---
title: "Logs"
description: "Akv2k8s logs"
--- 

## The Controller Logs

To access the akv2k8s Controller log:

```bash
kubectl -n akv2k8s logs deployment/akv2k8s-controller
```

## The Env-Injector Logs

To access the akv2k8s Env Injector log:

```bash
kubectl -n akv2k8s logs deployment/akv2k8s-envinjector
```

## Log levels and format

Akv2k8s support [structured logging](https://kubernetes.io/blog/2020/09/04/kubernetes-1-19-introducing-structured-logs/), using the latest Klog library (same logging library as Kubernetes). By default akv2k8s logs text at log-level `info`. 

Available log-levels: `info`, `debug` and `trace`
Available log-format: `text` and `json`

To change log-level or log-format, pass in these values to the akv2k8s Helm chart:

```
global.logLevel: info|debug|trace
global.logFormat: text|json
```

To override individual akv2k8s components:

```
controller.logLevel: info|debug|trace
controller.logFormat: text|json

env_injector.logLevel: info|debug|trace
env_injector.logFormat: text|json
```

Example:

```bash
helm upgrade --install akv2k8s spv-charts/akv2k8s \
  --namespace akv2k8s \
  --set global.logLevel=debug \
  --set global.logFormat=json
```