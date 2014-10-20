'use strict';

var sinon = require('sinon'),
    spy = sinon.spy,
    stub = sinon.stub;

// A mock version of the http.ClientRequest class
var MockRequest = module.exports = function MockRequest(opts) {
  if (opts == null) {
    opts = {};
  }

  this.url = "/";

  this.headers = {};

  for (var opt in opts) {
    this[opt] = opts[opt];
  }
};
