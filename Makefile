.PHONY: docs-install-dev
install:
	npm install

.PHONY: docs-run-dev
run:
	GATSBY_ALGOLIA_ENABLED=false npm run start

