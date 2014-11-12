/*
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Registry = require('./registry'),
    Config = require('./config'),
    Logger = require('./logger');

var testMode = function() {
  return process.env.NODE_ENV === 'test' && Config.testMode;
};

// Public: Creates a new Adaptor and returns it.
//
// opts - hash of acceptable params:
//   robot - Robot the Connection belongs to
//   name - name for the connection
//   adaptor - string module name of the adaptor to be set up
//   port - string port to use for the Connection
//
// Returns the newly set-up connection
module.exports = function Connection(opts) {
  var module;

  opts = opts || {};

  if (opts.module) {
    module = Registry.register(opts.module);
  } else {
    module = Registry.findByAdaptor(opts.adaptor);
  }

  if (!module) {
    Registry.register('cylon-' + opts.adaptor);
    module = Registry.findByAdaptor(opts.adaptor);
  }

  var adaptor = module.adaptor(opts);

  for (var prop in adaptor) {
    if (~['constructor'].indexOf(prop)) {
      continue;
    }

    if (typeof adaptor[prop] === 'function') {
      adaptor[prop] = adaptor[prop].bind(adaptor);
    }
  }

  if (testMode()) {
    var testAdaptor = Registry.findByAdaptor('test').adaptor(opts);

    for (var prop in adaptor) {
      if (typeof adaptor[prop] === 'function' && !testAdaptor[prop]) {
        testAdaptor[prop] = function() { return true; };
      }
    }

    return testAdaptor;
  }

  return adaptor;
};
