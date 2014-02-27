BIN := ./node_modules/.bin
TEST_FILES := test/support/globals.js $(shell find test/specs -type f -name "*.js")

# Our 'phony' make targets (don't involve any file changes)
.PHONY: test bdd lint

# Run Mocha, with standard reporter.
test:
	@$(BIN)/mocha --colors $(TEST_FILES)

# Run Mocha, with more verbose BDD reporter.
bdd:
	@$(BIN)/mocha --colors -R spec $(TEST_FILES)

# Run JSHint
lint:
	@$(BIN)/jshint ./lib
