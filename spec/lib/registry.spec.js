"use strict";

var Registry = source('registry');

var path = './../spec/support/mock_module.js';

var module = require('./../support/mock_module.js')

describe("Registry", function() {
  var original;

  beforeEach(function() {
    original = Registry.data;
    Registry.data = {};
  });

  afterEach(function() {
    Registry.data = original;
  })

  describe("#register", function() {
    it("adds the supplied module to the Registry", function() {
      expect(Registry.data).to.be.eql({});

      Registry.register(path);

      expect(Registry.data).to.be.eql({
        "./../spec/support/mock_module.js": {
          module: module,
          drivers: ['test-driver'],
          adaptors: ['test-adaptor'],
          dependencies: []
        }
      });
    });
  });

  describe("#findByAdaptor", function() {
    beforeEach(function() {
      Registry.register(path)
    });

    it("finds the appropriate module containing the adaptor", function() {
      expect(Registry.findByAdaptor('test-adaptor')).to.be.eql(module);
    });
  });

  describe("#findByDriver", function() {
    beforeEach(function() {
      Registry.register(path)
    });

    it("finds the appropriate module containing the driver", function() {
      expect(Registry.findByDriver('test-driver')).to.be.eql(module);
    });
  });
});
