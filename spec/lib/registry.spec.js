/* jshint expr:true */
"use strict";

var Registry = source("registry");

var path = "./../spec/support/mock_module.js";

var mod = require("./../support/mock_module.js");

describe("Registry", function() {
  var original;

  beforeEach(function() {
    original = Registry.data;
    Registry.data = {};
  });

  afterEach(function() {
    Registry.data = original;
  });

  describe("#register", function() {
    it("adds the supplied module to the Registry", function() {
      expect(Registry.data).to.be.eql({});

      Registry.register(path);

      expect(Registry.data).to.be.eql({
        "./../spec/support/mock_module.js": {
          module: mod,
          drivers: ["test-driver"],
          adaptors: ["test-adaptor"],
          dependencies: []
        }
      });
    });
  });
});
