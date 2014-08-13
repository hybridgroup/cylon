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

var missingModuleError = function(module) {
  var string = "Cannot find the '" + module + "' module. ";
  string += "Please install it with 'npm install " + module + "' and try again.";

  console.log(string);

  process.emit('SIGINT');
};

// Public: Creates a new Robot
//
// opts - object containing Robot options
//   name - optional, string name of the robot
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
var Robot = module.exports = function Robot(opts) {
  opts = opts || {};

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

  methods.forEach(function(method) {
    this[method] = this[method].bind(this);
  }.bind(this));

  this.name = opts.name || Robot.randomName();
  this.connections = {};
  this.devices = {};
  this.adaptors = {};
  this.drivers = {};
  this.commands = {};
  this.running = false;
  this.work = opts.work || opts.play;

  if (!this.work) {
    this.work =  function() { console.log("No work yet."); }
  }

  this.registerDefaults();

  this.initConnections(opts.connection || opts.connections);
  this.initDevices(opts.device || opts.devices);

  var hasDevices = !!Object.keys(this.devices).length,
      hasConnections = !!Object.keys(this.connections).length;

  if (hasDevices && !hasConnections) {
    throw new Error("No connections specified");
  }

  for (var n in opts) {
    var opt = opts[n],
        reserved = ['connection', 'connections', 'device', 'devices', 'work', 'commands'];

    if (reserved.indexOf(n) < 0) {
      this[n] = opt;

      if (opts.commands == null && typeof(opt) === 'function') {
        this.commands[n] = opt;
      }
    }
  }

  if (typeof opts.commands === 'function') {
    var result = opts.commands.call(this, this);
    if (typeof result === 'object' && !Array.isArray(result)) {
      this.commands = result;
    } else {
      throw new Error("commands must be an object or a function that returns an object");
    }
  }

  if (typeof opts.commands === 'object') {
    this.commands = opts.commands;
  }

};

Utils.subclass(Robot, EventEmitter);

// Public: Registers the default Drivers and Adaptors with Cylon.
//
// Returns nothing.
Robot.prototype.registerDefaults = function registerDefaults() {
  this.registerAdaptor("./test/loopback", "loopback");
  this.registerAdaptor("./test/test-adaptor", "test");

  this.registerDriver("./test/ping", "ping");
  this.registerDriver("./test/test-driver", "test");
};

// Public: Generates a random name for a Robot.
//
// Returns a string name
Robot.randomName = function() {
  return "Robot " + (Math.floor(Math.random() * 100000));
};

// Public: Expresses the Robot in a JSON-serializable format
//
// Returns an Object containing Robot data
Robot.prototype.toJSON = function() {
  var devices = [],
      connections = [];

  for (var n in this.connections) {
    connections.push(this.connections[n]);
  }

  for (var n in this.devices) {
    devices.push(this.devices[n]);
  }

  return {
    name: this.name,
    connections: connections,
    devices: devices,
    commands: Object.keys(this.commands)
  };
};

// Public: Initializes all connections for the robot
//
// connections - connections to initialize
//
// Returns initialized connections
Robot.prototype.initConnections = function(connections) {
  Logger.info("Initializing connections.");

  if (connections == null) {
    return;
  }

  connections = [].concat(connections);

  connections.forEach(function(conn) {
    Logger.info("Initializing connection '" + conn.name + "'.");
    conn['robot'] = this;
    this.connections[conn.name] = new Connection(conn);
  }.bind(this));

  return this.connections;
};

// Public: Initializes all devices for the robot
//
// devices - devices to initialize
//
// Returns initialized devices
Robot.prototype.initDevices = function(devices) {
  Logger.info("Initializing devices.");

  if (devices == null) {
    return;
  }

  devices = [].concat(devices);

  devices.forEach(function(device) {
    Logger.info("Initializing device '" + device.name + "'.");
    device['robot'] = this;
    this.devices[device.name] = new Device(device);
  }.bind(this));

  return this.devices;
};

// Public: Starts the Robot working.
//
// Starts the connections, devices, and work.
//
// Returns the result of the work
Robot.prototype.start = function() {
  var begin = function(callback) {
    this.work.call(this, this);
    this.running = true;
    this.emit('working');

    Logger.info('Working.');

    callback(null, true);
  }.bind(this);

  Async.series([
    this.startConnections,
    this.startDevices,
    begin
  ], function(err) {
    if (!!err) {
      Logger.fatal("An error occured while trying to start the robot:");
      Logger.fatal(err);
    }
  });
};

// Public: Starts the Robot's connections and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startConnections = function(callback) {
  var starters = {};

  Logger.info("Starting connections.");

  for (var n in this.connections) {
    var connection = this.connections[n];
    this[n] = connection;
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

  Logger.info("Starting devices.");

  for (var n in this.devices) {
    var device = this.devices[n];
    this[n] = device;
    starters[n] = device.start;
  }

  return Async.parallel(starters, callback);
};

// Public: Halts the Robot.
//
// Halts the devices, disconnects the connections.
//
// callback - callback to be triggered when the Robot is stopped
//
// Returns nothing
Robot.prototype.halt = function(callback) {
  var fns = [];

  for (var d in this.devices) {
    var device = this.devices[d];
    fns.push(device.halt.bind(device));
  }

  for (var c in this.connections) {
    var connection = this.connections[c];
    fns.push(connection.halt.bind(connection));
  }

  Async.parallel(fns, callback);
};

// Public: Initialize an adaptor and adds it to @robot.adaptors
//
// adaptorName - module name of adaptor to require
// connection - the Connection that requested the adaptor be required
//
// Returns the adaptor
Robot.prototype.initAdaptor = function(adaptorName, connection, opts) {
  if (opts == null) {
    opts = {};
  }

  var adaptor = this.requireAdaptor(adaptorName, opts).adaptor({
    name: adaptorName,
    connection: connection,
    extraParams: opts
  });

  if (config.testing_mode) {
    var testAdaptor = this.requireAdaptor('test').adaptor({
      name: adaptorName,
      connection: connection,
      extraParams: opts
    });
    return Utils.proxyTestStubs(adaptor.commands, testAdaptor);

    for (var prop in adaptor) {
      if (typeof adaptor[prop] === 'function' && !testAdaptor[prop]) {
        testAdaptor[prop] = function() { return true; }
      }
    }

    return testAdaptor;
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
  if (this.adaptors[adaptorName] == null) {
    var moduleName = opts.module || adaptorName;
    this.registerAdaptor("cylon-" + moduleName, adaptorName);
    this.adaptors[adaptorName].register(this);
  }
  return this.adaptors[adaptorName];
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
  if (opts == null) {
    opts = {};
  }

  var driver = this.requireDriver(driverName).driver({
    name: driverName,
    device: device,
    extraParams: opts
  });

  if (config.testing_mode) {
    var testDriver = this.requireDriver('test').driver({
      name: driverName,
      device: device,
      extraParams: opts
    });

    return Utils.proxyTestStubs(driver.commands, testDriver);
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
  if (this.drivers[driverName] == null) {
    this.registerDriver("cylon-" + driverName, driverName);
    this.drivers[driverName].register(this);
  }
  return this.drivers[driverName];
};

// Public: Registers an Driver with the Robot
//
// moduleName - name of the Node module to require
// driverName - name of the driver to register the moduleName under
//
// Returns the registered module name
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
