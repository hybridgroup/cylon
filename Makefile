BIN := ./node_modules/.bin
TEST_FILES := spec/helper.js $(shell find spec/lib -type f -name "*.js")

VERSION := $(shell node -e "console.log(require('./package.json').version)")

.PHONY: cover test bdd lint release

test:
	@$(BIN)/mocha --colors -R dot $(TEST_FILES)

bdd:
	@$(BIN)/mocha --colors -R spec $(TEST_FILES)

cover:
	@istanbul cover $(BIN)/_mocha $(TEST_FILES) --report lcovonly -- -R spec

lint:
	@jshint ./lib

release:
	@git push origin master
	@git checkout release ; git merge master ; git push ; git checkout master
	@git tag -m "$(VERSION)" v$(VERSION)
	@git push --tags
	@npm publish ./
