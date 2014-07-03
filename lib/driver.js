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

// Public: Creates a new Driver
//
// opts - hash of acceptable params
//   name - name of the Driver, used when printing to console
//   device - Device the driver will use to proxy commands/events
//
// Returns a new Driver
var Driver = module.exports = function Driver(opts) {
  opts = opts || {};

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
// callback - function to be triggered when the driver is halted
//
// Returns nothing
Driver.prototype.halt = function(callback) {
  Logger.info("Driver " + this.name + " halted.");
  this.removeAllListeners();
  callback();
};
