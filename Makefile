BIN := ./node_modules/.bin
TEST_FILES := test/support.js $(shell find test/specs -type f -name "*.js")

VERSION := $(shell node -e "console.log(require('./package.json').version)")

.PHONY: cover test bdd lint release

test:
	@$(BIN)/mocha --colors $(TEST_FILES)

cover:
	@$(BIN)/istanbul cover $(BIN)/_mocha $(TEST_FILES) --report lcovonly -- -R spec

bdd:
	@$(BIN)/mocha --colors -R spec $(TEST_FILES)

lint:
	@$(BIN)/jshint ./lib

release:
	@git tag -m "$(VERSION)" v$(VERSION)
	@git push --tags
	@npm publish ./
