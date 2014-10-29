"use strict";

var Repository = source('repository');

var path = './../spec/support/mock_module.js';

var module = require('./../support/mock_module.js')

describe("Repository", function() {
  describe("#register", function() {
    it("adds the supplied module to the Registry", function() {
      expect(Repository._data).to.be.eql({});

      Repository.register(path);

      expect(Repository._data).to.be.eql({
        "./../spec/support/mock_module.js": {
          module: module,
          drivers: ['test-driver'],
          adaptors: ['test-adaptor']
        }
      });
    });
  });

  describe("#findByAdaptor", function() {
    beforeEach(function() {
      Repository.register(path)
    });

    it("finds the appropriate module containing the adaptor", function() {
      expect(Repository.findByAdaptor('test-adaptor')).to.be.eql(module);
    });
  });

  describe("#findByDriver", function() {
    beforeEach(function() {
      Repository.register(path)
    });

    it("finds the appropriate module containing the driver", function() {
      expect(Repository.findByDriver('test-driver')).to.be.eql(module);
    });
  });
});
