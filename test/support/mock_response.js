'use strict';

var sinon = require('sinon'),
    spy = sinon.spy,
    stub = sinon.stub;

// A mock version of http.ServerResponse to be used in tests
var MockResponse = module.exports = function MockResponse() {
  this.end = spy();

  this.headers = {};
};

MockResponse.prototype.setHeader = function setHeader(name, value) {
  this.headers[name] = value;
};
