'use strict';

// allow production modules to expose internal
// functions and properties for testing
process.env.NODE_ENV = 'test';

var path = require('path');
var chai = require('chai');
var sinonChai = require('sinon-chai');

global.chai = chai;
global.should = chai.should();
global.expect = chai.expect;
global.assert = chai.assert;
global.AssertionError = chai.AssertionError;
global.sinon = require('sinon');

// can be used by test modules to require production modules,
// relative to the base path (where the Gruntfile.js also lives)
global.source = function (src) {
  console.log('source loading: ' +  src)
  var resource = path.normalize('../../dist/' + src);

  return require(resource);
};

// can be used when you expect a function to throw an error
global.err = function (fn, msg) {
  try {
    fn();
    throw new chai.AssertionError({ message: 'Expected an error' });
  } catch (err) {
    if ('string' === typeof msg) {
      chai.expect(err.message).to.equal(msg);
    } else {
      chai.expect(err.message).to.match(msg);
    }
  }
};

chai.use(sinonChai);

// if you want a detailed error stack output
// chai.Assertion.includeStack = true;
