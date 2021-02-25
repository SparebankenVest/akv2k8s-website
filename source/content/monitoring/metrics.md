---
title: "Metrics"
description: "Akv2k8s metrics"
--- 

Both the Controller and Env-Injector have Prometheus metrics than can be enabled through the Helm chart.

```bash
--set global.metrics.enabled=true
```

The above setting will enable a Prometheus endpoint that can be scraped for metrics.

If the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) is available in the cluster, a ServiceMonitor can be enabled to allow Prometheus to scrape the metrics.

```bash
--set global.metrics.serviceMonitor.enabled=true/false  # default false
--set global.metrics.serviceMonitor.interval=[timespan] # default 30s
```

The same settings are available for each component and can override global settings by replacing `global` with `controller` or `env_injector`. For other available settings, see [Helm chart](https://github.com/SparebankenVest/public-helm-charts/blob/master/stable/akv2k8s/README.md#configuration). To enable metrics for the Env-Injector only:

```bash
--set env_injector.metrics.enabled=true
```




## Available Env-Injector Metrics

```
akv2k8s_pod_mutations_total                # total number of pods mutated 
akv2k8s_pod_inspections_total              # total number of pods inspected, including mutated
akv2k8s_pod_mutations_failed_total         # total number of attempted pod mutations that failed
akv2k8s_auth_requests_total                # total number of successful auth requests
akv2k8s_auth_requests_failed_total         # total number failed auth requests
akv2k8s_auth_validations_total             # total number of successful auth validations
akv2k8s_auth_validations_failed_total      # total number of failed auth validations
akv2k8s_container_inspections_total        # total number of inspected container images
akv2k8s_container_inspections_failed_total # total number of failed container images inspections
```

## Available Controller Metrics

```
akv2k8s_syncs_total        # total number of syncs
akv2k8s_syncs_failed_total # total number of sync failures
```