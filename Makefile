.PHONY: docs-install-dev
docs-install-dev:
	npm install

.PHONY: docs-run-dev
docs-run-dev:
	GATSBY_ALGOLIA_ENABLED=false npm run start

