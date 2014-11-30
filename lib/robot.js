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
    Config = require('./config');

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
    "halt",
    "startDevices",
    "startConnections",
    "start",
    "initDevices",
    "initConnections"
  ];

  methods.forEach(function(method) {
    this[method] = this[method].bind(this);
  }, this);

  this.name = opts.name || Robot.randomName();
  this.connections = {};
  this.devices = {};
  this.adaptors = {};
  this.drivers = {};
  this.commands = {};
  this.running = false;
  this.work = opts.work || opts.play;

  if (!this.work) {
    this.work =  function() { Logger.debug("No work yet."); };
  }

  this.initConnections(opts);
  this.initDevices(opts);

  for (var n in opts) {
    var opt = opts[n];

    if (this[n] !== undefined) {
      continue;
    }

    this[n] = opt;

    if (typeof opt === 'function' && opts.commands == null) {
      this.commands[n] = opt;
    }
  }

  if (opts.commands) {
    var cmds = opts.commands;

    if (typeof cmds === 'object') {
      this.commands = cmds;
    }

    if (typeof cmds === 'function') {
      var result = cmds.call(this, this);

      if (typeof result === 'object' && !Array.isArray(result)) {
        this.commands = result;
      } else {
        throw new Error("#commands function must return an object");
      }
    }
  }

  var mode = Utils.fetch(Config, 'mode', 'manual');

  if (mode === 'auto') {
    // run on the next tick, to allow for 'work' event handlers to be set up
    setTimeout(this.start, 0);
  }
};

Utils.subclass(Robot, EventEmitter);

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
      connections = [],
      n;

  for (n in this.connections) {
    connections.push(this.connections[n].toJSON());
  }

  for (n in this.devices) {
    devices.push(this.devices[n].toJSON());
  }

  return {
    name: this.name,
    connections: connections,
    devices: devices,
    commands: Object.keys(this.commands)
  };
};

Robot.prototype.connection = function(name, conn) {
  conn.robot = this;
  conn.name = name;

  if (this.connections[conn.name]) {
    var original = conn.name;
    conn.name = Utils.makeUnique(original, Object.keys(this.connections));
    Logger.warn("Connection names must be unique. Renaming '" + original + "' to '" + conn.name + "'");
  }

  this.connections[conn.name] = Connection(conn);

  return this;
};

// Public: Initializes all connections for the robot
//
// opts - options array passed to constructor
//
// Returns initialized connections
Robot.prototype.initConnections = function(opts) {
  Logger.info("Initializing connections.");

  var isArray = Array.isArray;

  if (opts.connection == null && opts.connections == null) {
    return this.connections;
  }

  if (opts.connection) {
    Logger.warn("Specifying a single connection with the 'connection' key is deprecated, and will be removed in 1.0.0.");
    this.connection(opts.connection.name, opts.connection);
    return this.connections;
  }

  if (typeof opts.connections == 'object' && !isArray(opts.connections)) {
    for (var name in opts.connections) {
      this.connection(name, opts.connections[name]);
    }
  }

  if (isArray(opts.connections)) {
    Logger.warn("Specifying connections as an array is deprecated, and will be removed in 1.0.0.");
    opts.connections.forEach(function(conn) {
      this.connection(conn.name, conn);
    }, this);
  }

  return this.connections;
};

Robot.prototype.device = function(name, device) {
  device.robot = this;
  device.name = name;

  if (this.devices[device.name]) {
    var original = device.name;
    device.name = Utils.makeUnique(original, Object.keys(this.devices));
    Logger.warn("Device names must be unique. Renaming '" + original + "' to '" + device.name + "'");
  }

  if (typeof device.connection === 'string') {
    if (this.connections[device.connection] == null) {
      var str = "No connection found with the name " + device.connection + ".\n";
      Logger.fatal(str);
      process.emit('SIGINT');
    }

    device.connection  = this.connections[device.connection];
  } else {
    for (var conn in this.connections) {
      device.connection = this.connections[conn];
      break;
    }
  }

  this.devices[device.name] = Device(device);

  return this;
}

// Public: Initializes all devices for the robot
//
// opts - options array passed to constructor
//
// Returns initialized devices
Robot.prototype.initDevices = function(opts) {
  Logger.info("Initializing devices.");

  var isArray = Array.isArray;

  if (opts.device == null && opts.devices == null) {
    return this.devices;
  }

  // check that there are connections to use
  if (!Object.keys(this.connections).length) {
    throw new Error("No connections specified")
  }

  if (opts.device) {
    Logger.warn("Specifying a single device with the 'device' key is deprecated, and will be removed in 1.0.0.");
    this.device(opts.device.name, opts.device);
    return this.devices;
  }

  if (typeof opts.devices == 'object' && !isArray(opts.devices)) {
    for (var name in opts.devices) {
      this.device(name, opts.devices[name]);
    }
  }

  if (isArray(opts.devices)) {
    Logger.warn("Specifying devices as an array is deprecated, and will be removed in 1.0.0.");
    opts.devices.forEach(function(device) {
      this.device(device.name, device);
    }, this);
  }

  return this.devices;
};

// Public: Starts the Robot working.
//
// Starts the connections, devices, and work.
//
// Returns the result of the work
Robot.prototype.start = function(callback) {
  if (this.running) {
    return this;
  }

  var mode = Utils.fetch(Config, 'workMode', 'async');

  Async.series([
    this.startConnections,
    this.startDevices,
    function(callback) {
      if (mode === 'async') {
        this.startWork();
      }
      callback(null, true);
    }.bind(this)
  ], function(err, results) {
    if (!!err) {
      Logger.fatal("An error occured while trying to start the robot:");
      Logger.fatal(err);
      if (typeof(this.error) === 'function') {
        this.error.call(this, err);
      }
      this.emit('error', err);
    }
    if (typeof(callback) === 'function') {
      callback(err, results);
    }
  }.bind(this));

  return this;
};

// Public: Starts the Robot's work and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startWork = function() {
  Logger.info('Working.');

  this.emit('ready', this);
  this.work.call(this, this);
  this.running = true;
};

// Public: Starts the Robot's connections and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startConnections = function(callback) {
  Logger.info("Starting connections.");

  var starters = Object.keys(this.connections).map(function(n) {
    var conn = this[n] = this.connections[n];

    return function(cb) {
      var str = "Starting connection '" + n + "'";

      if (conn.host) {
        str += " on host " + conn.host;
      } else if (conn.port) {
        str += " on port " + conn.port;
      }

      Logger.debug(str + ".");
      return conn.connect.call(conn, cb);
    };
  }, this);

  return Async.parallel(starters, callback);
};

// Public: Starts the Robot's devices and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startDevices = function(callback) {
  Logger.info("Starting devices.");

  var starters = Object.keys(this.devices).map(function(n) {
    var device = this[n] = this.devices[n];

    return function(cb) {
      var str = "Starting device '" + n + "'";

      if (device.pin) {
        str += " on pin " + device.pin;
      }

      Logger.debug(str + ".");
      return device.start.call(device, cb);
    };
  }, this);

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
  callback = callback || function() {};

  var fns = Object.keys(this.devices).map(function(d) {
    var device = this.devices[d];
    return device.halt.bind(device);
  }, this);

  Async.parallel(fns, function() {
    var fns = Object.keys(this.connections).map(function(c) {
      var connection = this.connections[c];
      return connection.disconnect.bind(connection);
    }, this);

    Async.parallel(fns, callback);
  }.bind(this));

  this.running = false;
};

// Public: Returns basic info about the robot as a String
//
// Returns a String
Robot.prototype.toString = function() {
  return "[Robot name='" + this.name + "']";
};
