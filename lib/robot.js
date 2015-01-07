/*
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var initConnection = require("./connection"),
    initDevice = require("./device"),
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
// Example (CoffeeScript):
//    Cylon.robot
//      name: "Spherobot!"
//
//      connection:
//        name: "sphero", adaptor: "sphero", port: "/dev/rfcomm0"
//
//      device:
//        name: "sphero", driver: "sphero"
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

  _.bindAll(this, methods);

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
    Logger.warn(str);
  }

  this.connections[conn.name] = initConnection(conn);

  return this;
};

// Public: Initializes all connections for the robot
//
// opts - options array passed to constructor
//
// Returns initialized connections
Robot.prototype.initConnections = function(opts) {
  var str;

  Logger.info("Initializing connections.");

  if (opts.connection == null && opts.connections == null) {
    return this.connections;
  }

  if (opts.connection) {
    str = "Specifying a single connection with the 'connection' key ";
    str += "is deprecated. It will be removed in 1.0.0.";

    Logger.warn(str);

    this.connection(opts.connection.name, opts.connection);
    return this.connections;
  }

  if (_.isObject(opts.connections)) {
    if (_.isArray(opts.connections)) {
      str = "Specifying connections as an array is deprecated. ";
      str += "It will be removed in 1.0.0.";

      Logger.warn(str);

      _.forEach(opts.connections, function(conn, key) {
        var name = _.isString(key) ? key : conn.name;
        this.connection(name, conn);
      }, this);

      return this.connections;
    }

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
    Logger.warn(str);
  }

  if (typeof device.connection === "string") {
    if (this.connections[device.connection] == null) {
      str = "No connection found with the name " + device.connection + ".\n";
      Logger.fatal(str);
      process.emit("SIGINT");
    }

    device.connection = this.connections[device.connection];
  } else {
    device.connection = _.first(_.values(this.connections));
  }

  this.devices[device.name] = initDevice(device);

  return this;
};

// Public: Initializes all devices for the robot
//
// opts - options array passed to constructor
//
// Returns initialized devices
Robot.prototype.initDevices = function(opts) {
  var str;

  Logger.info("Initializing devices.");

  if (opts.device == null && opts.devices == null) {
    return this.devices;
  }

  // check that there are connections to use
  if (!Object.keys(this.connections).length) {
    throw new Error("No connections specified");
  }

  if (opts.device) {
    str = "Specifying a single device with the 'device' key is deprecated. ";
    str += "It will be removed in 1.0.0.";

    Logger.warn(str);
    this.device(opts.device.name, opts.device);
    return this.devices;
  }

  if (_.isObject(opts.devices)) {
    if (_.isArray(opts.devices)) {
      str = "Specifying devices as an array is deprecated. ";
      str += "It will be removed in 1.0.0.";

      Logger.warn(str);

      _.forEach(opts.devices, function(device, key) {
        var name = _.isString(key) ? key : device.name;
        this.device(name, device);
      }, this);

      return this.devices;
    }

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
      Logger.fatal("An error occured while trying to start the robot:");
      Logger.fatal(err);

      if (typeof(this.error) === "function") {
        this.error.call(this, err);
      }

      this.emit("error", err);
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
  Logger.info("Working.");

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
  Logger.info("Starting connections.");

  var starters = _.map(this.connections, function(conn, name) {
    this[name] = conn;

    return function(cb) {
      var str = "Starting connection '" + name + "'";

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

// Public: Starts the Robot"s devices and triggers a callback
//
// callback - callback function to be triggered
//
// Returns nothing
Robot.prototype.startDevices = function(callback) {
  Logger.info("Starting devices.");

  var starters = _.map(this.devices, function(device, name) {
    this[name] = device;

    return function(cb) {
      var str = "Starting device '" + name + "'";

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

  var devices = _.map(this.devices, "halt");
  var connections = _.map(this.connections, "disconnect");

  Async.parallel(devices, function() {
    Async.parallel(connections, callback);
  });

  this.running = false;
};

// Public: Returns basic info about the robot as a String
//
// Returns a String
Robot.prototype.toString = function() {
  return "[Robot name='" + this.name + "']";
};
