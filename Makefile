BIN := ./node_modules/.bin
TEST_FILES := spec/helper.js $(shell find spec/lib -type f -name "*.js")

VERSION := $(shell node -e "console.log(require('./package.json').version)")

.PHONY: default cover test bdd lint ci release

default: lint test

test:
	@$(BIN)/mocha --colors -R dot $(TEST_FILES)

bdd:
	@$(BIN)/mocha --colors -R spec $(TEST_FILES)

cover:
	@istanbul cover $(BIN)/_mocha $(TEST_FILES) --report lcovonly -- -R spec

lint:
	@$(BIN)/eslint lib spec examples

ci: lint cover

release: lint test
	@git push origin master
	@git checkout release ; git merge master ; git push ; git checkout master
	@git tag -m "$(VERSION)" v$(VERSION)
	@git push --tags
	@npm publish ./
