/*
 * driver
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Basestar = require('./basestar'),
    Logger = require('./logger'),
    Utils = require('./utils');

// The Driver class is a base class for Driver classes in external Cylon
// modules to use. It offers basic functions for starting/halting that
// descendant classes can use.
var Driver;

// Public: Creates a new Driver
//
// opts - hash of acceptable params
//   name - name of the Driver, used when printing to console
//   device - Device the driver will use to proxy commands/events
//
// Returns a new Driver
module.exports = Driver = function Driver(opts) {
  if (opts == null) {
    opts = {};
  }

  this.self = this;
  this.name = opts.name;
  this.device = opts.device;
  this.connection = this.device.connection;
};

Utils.subclass(Driver, Basestar);

Driver.prototype.commands = [];

// Public: Starts up the driver, and triggers the provided callback when done.
//
// callback - function to run when the driver is started
//
// Returns nothing
Driver.prototype.start = function(callback) {
  Logger.info("Driver " + this.name + " started.");
  callback(null);
  return true;
};

// Public: Halts the driver
//
// Returns nothing
Driver.prototype.halt = function() {
  Logger.info("Driver " + this.name + " halted.");
};
