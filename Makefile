BIN := ./node_modules/.bin

FILES := $(shell find lib spec/lib examples -type f -name "*.js" | grep -v lodash)
TEST_FILES := spec/helper.js $(shell find spec/lib -type f -name "*.js")

VERSION := $(shell node -e "console.log(require('./package.json').version)")

.PHONY: default cover test bdd lint ci release dist

default: lint test

test:
	@$(BIN)/mocha --colors -R dot $(TEST_FILES)

bdd:
	@$(BIN)/mocha --colors -R spec $(TEST_FILES)

cover:
	@istanbul cover $(BIN)/_mocha $(TEST_FILES) --report lcovonly -- -R spec

lint:
	@jshint $(FILES)

ci: lint cover

dist:
	@echo "Generating dist/cylon.js"
	@$(BIN)/browserify lib/cylon.js --standalone Cylon > dist/cylon.js
	@echo "Generating dist/cylon.min.js"
	@$(BIN)/uglifyjs --compress --mangle -- dist/cylon.js > dist/cylon.min.js 2>/dev/null

release: lint test
	@git push origin master
	@git checkout release ; git merge master ; git push ; git checkout master
	@git tag -m "$(VERSION)" v$(VERSION)
	@git push --tags
	@npm publish ./
