/*
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var initializer = require("./initializer"),
    Logger = require("./logger"),
    Utils = require("./utils"),
    Config = require("./config"),
    _ = require("./lodash");

var Async = require("async"),
    EventEmitter = require("events").EventEmitter;

// Public: Creates a new Robot
//
// opts - object containing Robot options
//   name - optional, string name of the robot
//   connection/connections - object connections to connect to
//   device/devices - object devices to connect to
//   work - work to be performed when the Robot is started
//
// Returns a new Robot
var Robot = module.exports = function Robot(opts) {
  opts = opts || {};

  var methods = [
    "toString",
    "halt",
    "startDevices",
    "startConnections",
    "start",
    "initRobot",
    "initDevices",
    "initConnections",
    "log"
  ];

  _.bindAll(this, methods);

  this.initRobot(opts);
  this.initConnections(opts);
  this.initDevices(opts);

  _.forEach(opts, function(opt, name) {
    if (this[name] !== undefined) {
      return;
    }

    this[name] = opt;

    if (opts.commands == null && _.isFunction(opt)) {
      this.commands[name] = opt;
    }
  }, this);

  if (opts.commands) {
    var cmds = _.result(opts, "commands");

    if (_.isObject(cmds) && !_.isArray(cmds)) {
      this.commands = cmds;
    } else {
      var err = "#commands must be an object ";
      err += "or a function that returns an object";
      throw new Error(err);
    }
  }

  var mode = Utils.fetch(Config, "mode", "manual");

  if (mode === "auto") {
    // run on the next tick, to allow for "work" event handlers to be set up
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
  return {
    name: this.name,
    connections: _.invoke(this.connections, "toJSON"),
    devices: _.invoke(this.devices, "toJSON"),
    commands: _.keys(this.commands),
    events: _.isArray(this.events) ? this.events : []
  };
};

Robot.prototype.connection = function(name, conn) {
  conn.robot = this;
  conn.name = name;

  if (this.connections[conn.name]) {
    var original = conn.name,
        str;

    conn.name = Utils.makeUnique(original, Object.keys(this.connections));

    str = "Connection names must be unique.";
    str += "Renaming '" + original + "' to '" + conn.name + "'";
    this.log("warn", str);
  }

  this.connections[conn.name] = initializer("adaptor", conn);

  return this;
};

// Public: Initializes all vars for robot
//
// opts - options array passed to constructor
//
// Returns null
Robot.prototype.initRobot = function(opts) {
  this.name = opts.name || Robot.randomName();
  this.connections = {};
  this.devices = {};
  this.adaptors = {};
  this.drivers = {};
  this.commands = {};
  this.running = false;
  this.work = opts.work || opts.play;

  if (!this.work) {
    this.work = function() { this.log("debug", "No work yet."); };
  }
};

// Public: Initializes all connections for the robot
//
// opts - options array passed to constructor
//
// Returns initialized connections
Robot.prototype.initConnections = function(opts) {
  this.log("info", "Initializing connections.");

  if (opts.connection == null && opts.connections == null) {
    return this.connections;
  }

  if (_.isObject(opts.connections)) {
    _.forIn(opts.connections, function(conn, key) {
      var name = _.isString(key) ? key : conn.name;

      if (conn.devices) {
        _.forIn(conn.devices, function(device, deviceName) {
          opts.devices = opts.devices || {};

          device.connection = name;

          opts.devices[deviceName] = device;
        });

        delete conn.devices;
      }

      this.connection(name, conn);
    }, this);
  }

  return this.connections;
};

Robot.prototype.device = function(name, device) {
  var str;

  device.robot = this;
  device.name = name;

  if (this.devices[device.name]) {
    var original = device.name;
    device.name = Utils.makeUnique(original, Object.keys(this.devices));

    str = "Device names must be unique.";
    str += "Renaming '" + original + "' to '" + device.name + "'";
    this.log("warn", str);
  }

  if (typeof device.connection === "string") {
    if (this.connections[device.connection] == null) {
      str = "No connection found with the name " + device.connection + ".\n";
      this.log("fatal", str);
      process.emit("SIGINT");
    }

    device.connection = this.connections[device.connection];
  } else {
    device.connection = _.first(_.values(this.connections));
  }

  this.devices[device.name] = initializer("driver", device);

  return this;
};

// Public: Initializes all devices for the robot
//
// opts - options array passed to constructor
//
// Returns initialized devices
Robot.prototype.initDevices = function(opts) {
  this.log("info", "Initializing devices.");

  if (opts.device == null && opts.devices == null) {
    return this.devices;
  }

  // check that there are connections to use
  if (!Object.keys(this.connections).length) {
    throw new Error("No connections specified");
  }

  if (_.isObject(opts.devices)) {
    _.forIn(opts.devices, function(device, key) {
      var name = _.isString(key) ? key : device.name;
      this.device(name, device);
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

  var mode = Utils.fetch(Config, "workMode", "async");

  var start = function() {
    if (mode === "async") {
      this.startWork();
    }
  }.bind(this);

  Async.series([
    this.startConnections,
    this.startDevices,
    start
  ], function(err, results) {
    if (!!err) {
      this.log("fatal", "An error occured while trying to start the robot:");
      this.log("fatal", err);

      this.halt(function() {
        if (typeof(this.error) === "function") {
          this.error.call(this, err);
        }

        if (this.listeners("error").length) {
          this.emit("error", err);
        }
      }.bind(this));
    }

    if (_.isFunction(callback)) {
      callback(err, results);
    }
  }.bind(this));

  return this;
};

// Public: Starts the Robot"s work and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startWork = function() {
  this.log("info", "Working.");

  this.emit("ready", this);
  this.work.call(this, this);
  this.running = true;
};

// Public: Starts the Robot"s connections and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startConnections = function(callback) {
  this.log("info", "Starting connections.");

  var starters = _.map(this.connections, function(conn, name) {
    this[name] = conn;

    return function(cb) {
      var str = "Starting connection '" + name + "'";

      if (conn.host) {
        str += " on host " + conn.host;
      } else if (conn.port) {
        str += " on port " + conn.port;
      }

      this.log("debug", str + ".");
      return conn.connect.call(conn, cb);
    }.bind(this);
  }, this);

  return Async.parallel(starters, callback);
};

// Public: Starts the Robot"s devices and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startDevices = function(callback) {
  var log = this.log;

  log("info", "Starting devices.");

  var starters = _.map(this.devices, function(device, name) {
    this[name] = device;

    return function(cb) {
      var str = "Starting device '" + name + "'";

      if (device.pin) {
        str += " on pin " + device.pin;
      }

      log("debug", str + ".");
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

  if (!this.isRunning) {
    return callback();
  }

  var devices = _.map(this.devices, "halt");
  var connections = _.map(this.connections, "disconnect");

  try {
    Async.parallel(devices, function() {
      Async.parallel(connections, callback);
    });
  } catch (e) {
    var msg = "An error occured while attempting to safely halt the robot";
    this.log("error", msg);
    this.log("error", e.message);
  }

  this.running = false;
};

// Public: Returns basic info about the robot as a String
//
// Returns a String
Robot.prototype.toString = function() {
  return "[Robot name='" + this.name + "']";
};

Robot.prototype.log = function(level) {
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift("[" + this.name + "] -");
  Logger[level].apply(null, args);
};
