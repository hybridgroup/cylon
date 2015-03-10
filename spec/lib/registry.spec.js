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

    context("when the module already exists", function() {
      it("returns the module", function() {
        expect(Registry.data).to.be.eql({});

        var result = Registry.register(path);

        // should register the module and return it
        expect(result).to.be.eql(mod);

        result = Registry.register(path);

        // should just return the existing module
        expect(result).to.be.eql(mod);

      });
    });
  });

  describe("#findBy", function() {
    beforeEach(function() {
      stub(Registry, "search");
    });

    afterEach(function() {
      Registry.search.restore();
    });

    it("calls #search, pluralizing if necessary", function() {
      Registry.findBy("adaptors", "testing");
      expect(Registry.search).to.be.calledWith("adaptors", "testing");

      Registry.findBy("driver", "testing");
      expect(Registry.search).to.be.calledWith("drivers", "testing");
    });
  });
});
