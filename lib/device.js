/*
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require('./utils');

var EventEmitter = require('events').EventEmitter;

// The Artoo::Device class represents the interface to
// a specific individual hardware devices. Examples would be a digital
// thermometer connected to an Arduino, or a Sphero's accelerometer
var Device;

// Public: Creates a new Device
//
// opts - object containing Device params
//   name - string name of the device
//   pin - string pin of the device
//   robot - parent Robot to the device
//   connection - connection to the device
//   driver - string name of the module the device driver logic lives in
//
// Returns a new Device
module.exports = Device = function Device(opts) {
  if (opts == null) {
    opts = {};
  }

  this.halt = bind(this.halt, this);
  this.start = bind(this.start, this);

  this.self = this;
  this.robot = opts.robot;
  this.name = opts.name;
  this.pin = opts.pin;
  this.connection = this.determineConnection(opts.connection) || this.defaultConnection();
  this.driver = this.initDriver(opts);

  proxyFunctionsToObject(this.driver.commands(), this.driver, this.self);
};

subclass(Device, EventEmitter);

// Public: Starts the device driver
//
// callback - callback function to be executed by the driver start
//
// Returns result of supplied callback
Device.prototype.start = function(callback) {
  var msg = "Starting device " + this.name;

  if (this.pin != null) {
    msg += " on pin " + this.pin;
  }

  Logger.info(msg);
  return this.driver.start(callback);
};

// Public: Halt the device driver
//
// Returns result of supplied callback
Device.prototype.halt = function() {
  Logger.info("Halting device " + this.name);
  return this.driver.halt();
};

// Public: Exports basic data for the Connection
//
// Returns an Object containing Connection data
Device.prototype.data = function() {
  return {
    name: this.name,
    driver: this.driver.constructor.name || this.driver.name,
    pin: this.pin,
    connection: this.connection.data(),
    commands: this.driver.commands()
  };
};

// Public: Retrieves the connections from the parent Robot instances
//
// c - name of the connection to fetch
//
// Returns a Connection instance
Device.prototype.determineConnection = function(c) {
  if (c) { return this.robot.connections[c]; }
};

// Public: Returns a default Connection to use
//
// Returns a Connection instance
Device.prototype.defaultConnection = function() {
  var first = 0;

  for (var c in this.robot.connections) {
    var connection = this.robot.connections[c];
    first || (first = connection);
  }

  return first;
};

// Public: sets up driver with @robot
//
// opts - object containing options when initializing driver
//   driver - name of the driver to intt()
//
// Returns the set-up driver
Device.prototype.initDriver = function(opts) {
  if (opts == null) { opts = {}; }
  Logger.debug("Loading driver '" + opts.driver + "'");
  return this.robot.initDriver(opts.driver, this.self, opts);
};
