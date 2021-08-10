const themeOptions = require('gatsby-theme-apollo-docs/theme-options');

module.exports = {
  pathPrefix: '/',
  plugins: [
    {
      resolve: 'gatsby-plugin-gtag',
      options: {
        // your google analytics tracking id
        trackingId: 'UA-136446489-2',
        // Puts tracking script in the head instead of the body
        head: true,
        // enable ip anonymization
        anonymize: false,
      },
    },
    {
      resolve: 'gatsby-theme-apollo-docs',
      options: {
        ...themeOptions,
        root: __dirname,
        baseUrl: 'https://akv2k8s.io',
        logoLink: 'https://akv2k8s.io/',
        baseDir: '',
        contentDir: 'source/content',
        siteName: '',
        pageTitle: 'akv2k8s docs',
        subtitle: '',
        description: 'How to get Azure Key Vault objects into Kubernetes',
        githubRepo: 'sparebankenvest/akv2k8s-website',
        segmentApiKey: null,
        algoliaApiKey: '3222f31991b019f454d81f025f0f26d3',
        algoliaIndexName: 'azure-key-vault-to-kubernetes',
        spectrumPath: '',
        spectrumHandle: '',
        twitterHandle: '',
        defaultVersion: '1.3',
        versions: {
          '1.2': 'v1.2.3',
          '1.1': 'v1.1.0',
          '1.0': 'v1.0.2',
        },
        sidebarCategories: {
          null: ['index', 'why-akv2k8s', 'quick-start', 'how-it-works', 'faq'],
          'Installation': [
            'installation/index',
            'installation/requirements',
            'installation/on-azure-aks',
            'installation/outside-azure-aks',
            'installation/crd',
            'installation/without-helm',
            'installation/upgrade',
            'installation/with-aad-pod-identity',
          ],
          Tutorials: [
            'tutorials/index',
            'tutorials/prerequisites',
            'tutorials/sync/1-secret',
            'tutorials/sync/2-certificate',
            'tutorials/sync/3-signing-key',
            'tutorials/sync/4-multi-key-value-secret',
            'tutorials/sync/5-multi-akvs-to-one-secret',
            'tutorials/sync/6-secret-to-configmap',
            'tutorials/sync/7-namespace-isolation-of-controller',
            'tutorials/sync/8-label-filtered-syncing',
            'tutorials/env-injection/1-secret',
            'tutorials/env-injection/2-certificate',
            'tutorials/env-injection/3-signing-key',
            'tutorials/env-injection/5-pfx-certificate',
          ],
          Security: [
            'security/introduction',
            'security/authentication',
            'security/authorization',
            'security/enable-env-injection',
          ],
          Monitoring: [
            'monitoring/logs',
            'monitoring/metrics',
          ],
          Troubleshooting: [
            'troubleshooting/controller-log',
            'troubleshooting/env-injector-log-level',
            'troubleshooting/known-issues',
          ],
          Reference: [
            'reference/azure-key-vault-secret',
          ],
        },
        navConfig: {},
        // navConfig: {
        //   'Controller Basics': {
        //     url: 'https://www.apollographql.com/docs',
        //     description: 'Learn how the Controller syncs Azure Key Vault objects to Kubernetes as native Secrets.',
        //   },
        //   'Injector Basics': {
        //     url: 'https://www.apollographql.com/docs/apollo-server',
        //     description: 'Learn how the Injector injects Azure Key Vault objects as environment variabled directly into your application'
        //   },
        //   'When to use which': {
        //     url: 'https://www.apollographql.com/docs/apollo-server',
        //     description: 'Learn when to use the Controller and when to use the Injector'
        //   },
        // },
      },
    },
  ],
};
