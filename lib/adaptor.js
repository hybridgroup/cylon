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

  this.self = this;
  this.name = opts.name;
  this.connection = opts.connection;
  this.commandList = [];
};

Utils.subclass(Adaptor, Basestar);

// Public: Exposes all commands the adaptor will respond to/proxy
//
// Returns an array of string method names
Adaptor.prototype.commands = function() {
  return this.commandList;
};

// Public: Connects to the adaptor, and emits 'connect' from the @connection
// when done.
//
// callback - function to run when the adaptor is connected
//
// Returns nothing
Adaptor.prototype.connect = function(callback) {
  Logger.info("Connecting to adaptor '" + this.name + "'...");
  callback(null);
  return this.connection.emit('connect');
};

// Public: Disconnects from the adaptor
//
// Returns nothing
Adaptor.prototype.disconnect = function() {
  return Logger.info("Disconnecting from adaptor '" + this.name + "'...");
};
