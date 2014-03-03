/*
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require('./cylon');
require('./driver');
require('./utils');

var namespace = require('node-namespace'),
    EventEmitter = require('events').EventEmitter;

// The Artoo::Device class represents the interface to
// a specific individual hardware devices. Examples would be a digital
// thermometer connected to an Arduino, or a Sphero's accelerometer
namespace("Cylon", function() {
  this.Device = (function(klass) {
    subclass(Device, klass);

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
    function Device(opts) {
      if (opts == null) { opts = {}; }

      this.stop = bind(this.stop, this);
      this.start = bind(this.start, this);

      this.self = this;
      this.robot = opts.robot;
      this.name = opts.name;
      this.pin = opts.pin;
      this.connection = this.determineConnection(opts.connection) || this.defaultConnection();
      this.driver = this.initDriver(opts);

      proxyFunctionsToObject(this.driver.commands(), this.driver, this.self);
    }

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

    // Public: Stops the device driver
    //
    // Returns result of supplied callback
    Device.prototype.stop = function() {
      Logger.info("Stopping device " + this.name);
      return this.driver.stop();
    };

    // Public: Exports basic data for the Connection
    //
    // Returns an Object containing Connection data
    Device.prototype.data = function() {
      return {
        name: this.name,
        driver: this.driver.constructor.name || this.driver.name,
        pin: this.pin != null ? this.pin.toString : null,
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

    return Device;

  })(EventEmitter);
});

module.exports = Cylon.Device;
