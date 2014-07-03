/*
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Basestar = require('./basestar'),
    Logger = require('./logger'),
    Utils = require('./utils');

// The Adaptor class is a base class for Adaptor classes in external Cylon
// modules to use. It offers basic functions for connecting/disconnecting that
// descendant classes can use.
var Adaptor;

// Public: Creates a new Adaptor
//
// opts - hash of acceptable params
//   name - name of the Adaptor, used when printing to console
//   connection - Connection the adaptor will use to proxy commands/events
//
// Returns a new Adaptor
module.exports = Adaptor = function Adaptor(opts) {
  if (opts == null) {
    opts = {};
  }

  this.name = opts.name;
  this.connection = opts.connection;
};

Utils.subclass(Adaptor, Basestar);

Adaptor.prototype.commands = [];

// Public: Connects to the adaptor, and triggers the provided callback when
// done.
//
// callback - function to run when the adaptor is connected
//
// Returns nothing
Adaptor.prototype.connect = function(callback) {
  Logger.info("Connecting to adaptor '" + this.name + "'.");
  callback(null);
  return true;
};

// Public: Disconnects from the adaptor
//
// callback - function to run when the adaptor is disconnected
//
// Returns nothing
Adaptor.prototype.disconnect = function(callback) {
  Logger.info("Disconnecting from adaptor '" + this.name + "'.");
  this.removeAllListeners();
  callback();
};

// Public: Voids all command functions so they do not interact
// with anything after disconnect has been called.
//
// Returns nothing
Adaptor.prototype._noop = function() {
  this.commands.forEach((function(command) {
    this[command] = function() { return null; };
  }).bind(this));
};
