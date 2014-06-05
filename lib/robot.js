/*
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Connection = require("./connection"),
    Device = require("./device"),
    Logger = require('./logger'),
    Utils = require('./utils'),
    config = require('./config');

var Async = require("async"),
    EventEmitter = require('events').EventEmitter;

// A Robot is the primary interface for interacting with a collection of physical
// computing capabilities.
var Robot;

// Public: Creates a new Robot
//
// opts - object containing Robot options
//   name - optional, string name of the robot
//   master - Cylon.Master class that orchestrates robots
//   connection/connections - object connections to connect to
//   device/devices - object devices to connect to
//   work - work to be performed when the Robot is started
//
// Returns a new Robot
// Example (CoffeeScript):
//    Cylon.robot
//      name: "Spherobot!"
//
//      connection:
//        name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'
//
//      device:
//        name: 'sphero', driver: 'sphero'
//
//      work: (me) ->
//        Utils.every 1.second(), ->
//          me.sphero.roll 60, Math.floor(Math.random() * 360//
module.exports = Robot = function Robot(opts) {
  if (opts == null) {
    opts = {};
  }

  var methods = [
    "toString",
    "registerDriver",
    "requireDriver",
    "registerAdaptor",
    "requireAdaptor",
    "halt",
    "startDevices",
    "startConnections",
    "start",
    "initDevices",
    "initConnections"
  ];

  for (var i = 0; i < methods.length ; i++) {
    var method = methods[i];
    this[method] = Utils.bind(this[method], this);
  }

  this.robot = this;
  this.name = opts.name || this.constructor.randomName();
  this.master = opts.master;

  this.connections = {};
  this.devices = {};
  this.adaptors = {};
  this.drivers = {};
  this.commands = [];

  this.running = false;

  this.registerAdaptor("./test/loopback", "loopback");
  this.registerAdaptor("./test/test-adaptor", "test");
  this.registerDriver("./test/ping", "ping");
  this.registerDriver("./test/test-driver", "test");

  this.initConnections(opts.connection || opts.connections);
  this.initDevices(opts.device || opts.devices);

  this.work = opts.work || opts.play;

  this.work || (this.work = function() { Logger.info("No work yet"); });

  for (var n in opts) {
    var func = opts[n],
        reserved = ['connection', 'connections', 'device', 'devices', 'work'];

    if (reserved.indexOf(n) < 0) { this.robot[n] = func; }
  }
};

Utils.subclass(Robot, EventEmitter);

// Public: Generates a random name for a Robot.
//
// Returns a string name
Robot.randomName = function() {
  return "Robot " + (Math.floor(Math.random() * 100000));
};

// Public: Exports basic data for the Robot
//
// Returns an Object containing Robot data
Robot.prototype.data = function() {
  var connections = (function() {
    var results = [];
    for (var n in this.connections) {
      var conn = this.connections[n];
      results.push(conn.data());
    }
    return results;
  }).call(this);

  var devices = (function() {
    var results = [];
    for (var n in this.devices) {
      var device = this.devices[n];
      results.push(device.data());
    }
    return results;
  }).call(this);

  return {
    name: this.name,
    connections: connections,
    devices: devices,
    commands: this.commands
  };
};

// Public: Initializes all connections for the robot
//
// connections - connections to initialize
//
// Returns initialized connections
Robot.prototype.initConnections = function(connections) {
  Logger.info("Initializing connections...");
  if (connections == null) { return; }

  connections = [].concat(connections);

  for (var i = 0; i < connections.length; i++) {
    var connection = connections[i];
    Logger.info("Initializing connection '" + connection.name + "'...");
    connection['robot'] = this;
    this.connections[connection.name] = new Connection(connection);
  }

  return this.connections;
};

// Public: Initializes all devices for the robot
//
// devices - devices to initialize
//
// Returns initialized devices
Robot.prototype.initDevices = function(devices) {
  Logger.info("Initializing devices...");
  if (devices == null) { return; }

  devices = [].concat(devices);

  for (var i = 0; i < devices.length; i++) {
    var device = devices[i];
    Logger.info("Initializing device '" + device.name + "'...");
    device['robot'] = this;
    this.devices[device.name] = this._createDevice(device);
  }

  return this.devices;
};

Robot.prototype._createDevice = function(device) {
  return new Device(device);
};

// Public: Starts the Robot working.
//
// Starts the connections, devices, and work.
//
// Returns the result of the work
Robot.prototype.start = function() {
  var self = this;
  return this.startConnections(function() {
    return self.robot.startDevices(function(err) {
      if (err) {
        throw err;
      }else{
        self.robot.work.call(self.robot, self.robot);
        self.running = true;
        Logger.info("Working...");
        self.robot.emit('working');
      }
    });
  });
};

// Public: Starts the Robot's connections and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startConnections = function(callback) {
  var starters = {};

  Logger.info("Starting connections...");

  for (var n in this.connections) {
    var connection = this.connections[n];
    this.robot[n] = connection;
    starters[n] = connection.connect;
  }

  return Async.parallel(starters, callback);
};

// Public: Starts the Robot's devices and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startDevices = function(callback) {
  var starters = {};

  Logger.info("Starting devices...");

  for (var n in this.devices) {
    var device = this.devices[n];
    this.robot[n] = device;
    starters[n] = device.start;
  }

  return Async.parallel(starters, callback);
};

// Public: Halts the Robot.
//
// Halts the devices, disconnects the connections.
//
// Returns nothing
Robot.prototype.halt = function() {
  for (var d in this.devices) { this.devices[d].halt(); }
  for (var c in this.connections) { this.connections[c].halt(); }
};

// Public: Initialize an adaptor and adds it to @robot.adaptors
//
// adaptorName - module name of adaptor to require
// connection - the Connection that requested the adaptor be required
//
// Returns the adaptor
Robot.prototype.initAdaptor = function(adaptorName, connection, opts) {
  if (opts == null) { opts = {}; }

  var adaptor = this.robot.requireAdaptor(adaptorName, opts).adaptor({
    name: adaptorName,
    connection: connection,
    extraParams: opts
  });

  if (config.testing_mode) {
    var testAdaptor = this.robot.requireAdaptor('test').adaptor({
      name: adaptorName,
      connection: connection,
      extraParams: opts
    });
    return Utils.proxyTestStubs(adaptor.commands(), testAdaptor);
  } else {
    return adaptor;
  }
};

// Public: Requires a hardware adaptor and adds it to @robot.adaptors
//
// adaptorName - module name of adaptor to require
//
// Returns the module for the adaptor
Robot.prototype.requireAdaptor = function(adaptorName, opts) {
  if (this.robot.adaptors[adaptorName] == null) {
    var moduleName = opts.module || adaptorName;
    this.robot.registerAdaptor("cylon-" + moduleName, adaptorName);
    this.robot.adaptors[adaptorName].register(this);
  }
  return this.robot.adaptors[adaptorName];
};

// Public: Registers an Adaptor with the Robot
//
// moduleName - name of the Node module to require
// adaptorName - name of the adaptor to register the moduleName under
//
// Returns the registered module name
Robot.prototype.registerAdaptor = function(moduleName, adaptorName) {
  if (this.adaptors[adaptorName] == null) {
    try {
      return this.adaptors[adaptorName] = require(moduleName);
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        missingModuleError(moduleName);
      } else {
        throw e;
      }
    }
  }
};

// Public: Init a hardware driver
//
// driverName - driver name
// device - the Device that requested the driver be initialized
// opts - object containing options when initializing driver
//
// Returns the new driver
Robot.prototype.initDriver = function(driverName, device, opts) {
  if (opts == null) { opts = {}; }

  var driver = this.robot.requireDriver(driverName).driver({
    name: driverName,
    device: device,
    extraParams: opts
  });

  if (config.testing_mode) {
    var testDriver = this.robot.requireDriver('test').driver({
      name: driverName,
      device: device,
      extraParams: opts
    });

    return Utils.proxyTestStubs(driver.commands(), testDriver);
  } else {
    return driver;
  }
};

// Public: Requires module for a driver and adds it to @robot.drivers
//
// driverName - module name of driver to require
//
// Returns the module for driver
Robot.prototype.requireDriver = function(driverName) {
  if (this.robot.drivers[driverName] == null) {
    this.robot.registerDriver("cylon-" + driverName, driverName);
    this.robot.drivers[driverName].register(this);
  }
  return this.robot.drivers[driverName];
};

// Public: Registers an Driver with the Robot
//
// moduleName - name of the Node module to require
// driverName - name of the driver to register the moduleName under
//
// Returns the registered module nam//
Robot.prototype.registerDriver = function(moduleName, driverName) {
  if (this.drivers[driverName] == null) {
    try {
      return this.drivers[driverName] = require(moduleName);
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        missingModuleError(moduleName);
      } else {
        throw e;
      }
    }
  }
};

// Public: Returns basic info about the robot as a String
//
// Returns a String
Robot.prototype.toString = function() {
  return "[Robot name='" + this.name + "']";
};

var missingModuleError = function(module) {
  var string = "Cannot find the '" + module + "' module. ";
  string += "Please install it with 'npm install " + module + "' and try again.";

  console.log(string);

  process.emit('SIGINT');
};
