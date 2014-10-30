/*
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var EventEmitter = require('events').EventEmitter;

var Repository = require('./repository'),
    Logger = require('./logger'),
    Utils = require('./utils');

var testMode = process.env.NODE_ENV === 'test' && !CYLON_TEST;

// Public: Creates a new Connection
//
// opts - hash of acceptable params:
//   robot - Robot the Connection belongs to
//   name - name for the connection
//   adaptor - string module name of the adaptor to be set up
//   port - string port to use for the Connection
//
// Returns the newly set-up connection
var Connection = module.exports = function Connection(opts) {
  opts = opts || {};

  this.connect = this.connect.bind(this);

  this.robot = opts.robot;
  this.name = opts.name;
  this.port = opts.port;
  this.adaptor = this.initAdaptor(opts);

  this.details = {};

  for (var opt in opts) {
    if (['robot', 'name', 'adaptor'].indexOf(opt) < 0) {
      this.details[opt] = opts[opt];
    }
  }
};

Utils.subclass(Connection, EventEmitter);

// Public: Expresses the Connection in JSON format
//
// Returns an Object containing Connection data
Connection.prototype.toJSON = function() {
  return {
    name: this.name,
    adaptor: this.adaptor.constructor.name || this.adaptor.name,
    details: this.details
  };
};

// Public: Connect the adaptor's connection
//
// callback - callback function to run when the adaptor is connected
//
// Returns nothing
Connection.prototype.connect = function(callback) {
  var msg = this._logstring("Connecting to");
  Logger.info(msg);
  this.adaptor.connect(function() {
    Utils.proxyFunctions(this.adaptor, this)
    callback.apply(this, arguments);
  }.bind(this));
};

// Public: Disconnect the adaptor's connection
//
// callback - function to be triggered then the adaptor has disconnected
//
// Returns nothing
Connection.prototype.disconnect = function(callback) {
  var msg = this._logstring("Disconnecting from");
  Logger.info(msg);
  this.removeAllListeners();
  this.adaptor.disconnect(callback);
};

// Public: sets up adaptor with @robot
//
// opts - options for adaptor being initialized
//   adaptor - name of the adaptor
//
// Returns the set-up adaptor
Connection.prototype.initAdaptor = function(opts) {
  var module = Repository.findByAdaptor(opts.adaptor);

  opts.connection = this;

  if (!module) {
    Repository.register('cylon-' + opts.adaptor);
    module = Repository.findByAdaptor(opts.adaptor);
  }

  var adaptor = module.adaptor(opts);

  if (testMode) {
    var testAdaptor = Repository.findByAdaptor('test').adaptor(opts);

    for (var prop in adaptor) {
      if (typeof adaptor[prop] === 'function' && !testAdaptor[prop]) {
        testAdaptor[prop] = function() { return true; };
      }
    }

    return testAdaptor;
  }

  return adaptor;
};

Connection.prototype._logstring = function _logstring(action) {
  var msg = action + " '" + this.name + "'";

  if (this.port != null) {
    msg += " on port " + this.port;
  }

  msg += ".";

  return msg;
};
