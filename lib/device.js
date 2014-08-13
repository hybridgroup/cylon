/*
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var EventEmitter = require('events').EventEmitter;

var Logger = require('./logger'),
    Utils = require('./utils');

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
var Device = module.exports = function Device(opts) {
  if (opts == null) {
    opts = {};
  }

  this.halt = this.halt.bind(this);
  this.start = this.start.bind(this);

  this.robot = opts.robot;
  this.name = opts.name;
  this.pin = opts.pin;
  this.connection = this.determineConnection(opts.connection) || this.defaultConnection();
  this.driver = this.initDriver(opts);

  this.details = {};

  for (var opt in opts) {
    if (['robot', 'name', 'connection', 'driver'].indexOf(opt) < 0) {
      this.details[opt] = opts[opt];
    }
  }

  for (var opt in this.driver) {
    if (!this[opt] && typeof this.driver[opt] === 'function') {
      this[opt] = this.driver[opt].bind(this.driver);
    }
  }
};

Utils.subclass(Device, EventEmitter);

// Public: Starts the device driver
//
// callback - callback function to be executed by the driver start
//
// Returns result of supplied callback
Device.prototype.start = function(callback) {
  var msg = "Starting device '" + this.name + "'";

  if (this.pin != null) {
    msg += " on pin " + this.pin;
  }

  msg += ".";

  Logger.info(msg);
  return this.driver.start(callback);
};

// Public: Halt the device driver
//
// callback - function to trigger when the device has been halted
//
// Returns result of supplied callback
Device.prototype.halt = function(callback) {
  Logger.info("Halting device '" + this.name + "'.");
  this.driver.halt(callback);
};

// Public: Expresses the Device in JSON format
//
// Returns an Object containing Connection data
Device.prototype.toJSON = function() {
  return {
    name: this.name,
    driver: this.driver.constructor.name || this.driver.name,
    connection: this.connection.name,
    commands: Object.keys(this.driver.commands),
    details: this.details
  };
};

// Public: Retrieves the connections from the parent Robot instances
//
// conn - name of the connection to fetch
//
// Returns a Connection instance
Device.prototype.determineConnection = function(conn) {
  return this.robot.connections[conn];
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
  if (opts == null) {
    opts = {};
  }

  Logger.debug("Loading driver '" + opts.driver + "'.");
  return this.robot.initDriver(opts.driver, this, opts);
};
