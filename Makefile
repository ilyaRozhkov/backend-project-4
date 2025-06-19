install:
	npm ci

lint:
	npx eslint .

fix-lint:
	npx eslint --fix .

test:
	npx jest

clear-test:
	clear
	npx jest

debug-run:
	DEBUG=page-loader,axios page-loader <url>

test-coverage:
	npx jest --coverage