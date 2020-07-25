IMAGE = biyete-js-env
RUN = docker run --rm --mount src="$(shell pwd)",target=/src,type=bind $(IMAGE)

db docker-build:
	docker build -f Dockerfile -t $(IMAGE) .

di docker-script-install:
	$(RUN) sh -c "yarn install"

dsb docker-script-build:
	$(RUN) sh -c "npm run build"

dr docker-script-release:
	make docker-script-build
	$(RUN) sh -c "node tools/GoogleScriptFormat.js"

dcz docker-script-commitizen:
	$(RUN) sh -c "git-cz"

dl docker-script-lint:
	$(RUN) sh -c "npm run lint"

b build:
	npm run build

c commit:
	# Need commitizen installed globally in your machine
	git-cz

g github:
	make docker-build
	$(RUN) sh -c "npm install && npm run test"

i install:
	yarn install

r release:
	make build
	node tools/GoogleScriptFormat.js

l lint:
	npm run lint

lf lint-fix:
	npm run lint:fix

t test:
	npm run test

tj jest test-jest:
	npm run jest

w watch:
	npm run watch

default:
	make build
