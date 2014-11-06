'use strict';

process.env.NODE_ENV = 'test';

var path = require('path');

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.chai = chai;
global.sinon = sinon;

global.should = chai.should();
global.expect = chai.expect;
global.assert = chai.assert;
global.AssertionError = chai.AssertionError;

global.spy = sinon.spy;
global.stub = sinon.stub;

// convenience function to require modules in lib directory
global.source = function(module) {
  return require(path.normalize('./../lib/' + module));
};

var Cylon = source('cylon');

Cylon.config({
  mode: "manual",
  logging: {
    logger: false
  }
});

Cylon.Logger.setup();
