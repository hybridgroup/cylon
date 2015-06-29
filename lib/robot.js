"use strict";

var initializer = require("./initializer"),
    Logger = require("./logger"),
    Utils = require("./utils"),
    Config = require("./config"),
    _ = require("./utils/helpers");

var validator = require("./validator");

var EventEmitter = require("events").EventEmitter;

// used when creating default robot names
var ROBOT_ID = 1;

/**
 * Creates a new Robot instance based on provided options
 *
 * @constructor
 * @param {Object} opts object with Robot options
 * @param {String} [name] the name the robot should have
 * @param {Object} [connections] object containing connection info for the Robot
 * @param {Object} [devices] object containing device information for the Robot
 * @param {Function} [work] a function the Robot will run when started
 * @returns {Robot} new Robot instance
 */
var Robot = module.exports = function Robot(opts) {
  Utils.classCallCheck(this, Robot);

  opts = opts || {};

  validator.validate(opts);

  // auto-bind prototype methods
  for (var prop in Object.getPrototypeOf(this)) {
    if (this[prop] && prop !== "constructor") {
      this[prop] = this[prop].bind(this);
    }
  }

  this.initRobot(opts);

  _.each(opts, function(opt, name) {
    if (this[name] !== undefined) {
      return;
    }

    if (_.isFunction(opt)) {
      this[name] = opt.bind(this);

      if (opts.commands == null) {
        this.commands[name] = opt.bind(this);
      }
    } else {
      this[name] = opt;
    }
  }, this);

  if (opts.commands) {
    var cmds;

    if (_.isFunction(opts.commands)) {
      cmds = opts.commands.call(this);
    } else {
      cmds = opts.commands;
    }

    if (_.isObject(cmds)) {
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

/**
 * Condenses information on a Robot to a JSON-serializable format
 *
 * @return {Object} serializable information on the Robot
 */
Robot.prototype.toJSON = function() {
  return {
    name: this.name,
    connections: _.invoke(this.connections, "toJSON"),
    devices: _.invoke(this.devices, "toJSON"),
    commands: Object.keys(this.commands),
    events: _.isArray(this.events) ? this.events : []
  };
};

/**
 * Adds a new Connection to the Robot with the provided name and details.
 *
 * @param {String} name string name for the Connection to use
 * @param {Object} conn options for the Connection initializer
 * @return {Object} the robot
 */
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

/**
 * Initializes all values for a new Robot.
 *
 * @param {Object} opts object passed to Robot constructor
 * @return {void}
 */
Robot.prototype.initRobot = function(opts) {
  this.name = opts.name || "Robot " + ROBOT_ID++;
  this.running = false;

  this.connections = {};
  this.devices = {};

  this.work = opts.work || opts.play;

  this.commands = {};

  if (!this.work) {
    this.work = function() { this.log("debug", "No work yet."); };
  }

  _.each(opts.connections, function(conn, key) {
    var name = _.isString(key) ? key : conn.name;

    if (conn.devices) {
      opts.devices = opts.devices || {};

      _.each(conn.devices, function(device, d) {
        device.connection = name;
        opts.devices[d] = device;
      });

      delete conn.devices;
    }

    this.connection(name, _.extend({}, conn));
  }, this);

  _.each(opts.devices, function(device, key) {
    var name = _.isString(key) ? key : device.name;
    this.device(name, _.extend({}, device));
  }, this);
};

/**
 * Adds a new Device to the Robot with the provided name and details.
 *
 * @param {String} name string name for the Device to use
 * @param {Object} device options for the Device initializer
 * @return {Object} the robot
 */
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

  if (_.isString(device.connection)) {
    if (this.connections[device.connection] == null) {
      str = "No connection found with the name " + device.connection + ".\n";
      this.log("fatal", str);
      process.emit("SIGINT");
    }

    device.connection = this.connections[device.connection];
  } else {
    for (var c in this.connections) {
      device.connection = this.connections[c];
      break;
    }
  }

  this.devices[device.name] = initializer("driver", device);

  return this;
};

/**
 * Starts the Robot's connections, then devices, then work.
 *
 * @param {Function} callback function to be triggered when the Robot has
 * started working
 * @return {Object} the Robot
 */
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

  _.series([
    this.startConnections,
    this.startDevices,
    start
  ], function(err, results) {
    if (err) {
      this.log("fatal", "An error occured while trying to start the robot:");
      this.log("fatal", err);

      this.halt(function() {
        if (_.isFunction(this.error)) {
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

/**
 * Starts the Robot's work function
 *
 * @return {void}
 */
Robot.prototype.startWork = function() {
  this.log("info", "Working.");

  this.emit("ready", this);
  this.work.call(this, this);
  this.running = true;
};

/**
 * Starts the Robot's connections
 *
 * @param {Function} callback function to be triggered after the connections are
 * started
 * @return {void}
 */
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

  return _.parallel(starters, callback);
};

/**
 * Starts the Robot's devices
 *
 * @param {Function} callback function to be triggered after the devices are
 * started
 * @return {void}
 */
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

  return _.parallel(starters, callback);
};

/**
 * Halts the Robot, attempting to gracefully stop devices and connections.
 *
 * @param {Function} callback to be triggered when the Robot has stopped
 * @return {void}
 */
Robot.prototype.halt = function(callback) {
  callback = callback || function() {};

  if (!this.running) {
    return callback();
  }

  var devices = _.pluck(this.devices, "halt"),
      connections = _.pluck(this.connections, "disconnect");

  try {
    _.parallel(devices, function() {
      _.parallel(connections, callback);
    });
  } catch (e) {
    var msg = "An error occured while attempting to safely halt the robot";
    this.log("error", msg);
    this.log("error", e.message);
  }

  this.running = false;
};

/**
 * Generates a String representation of a Robot
 *
 * @return {String} representation of a Robot
 */
Robot.prototype.toString = function() {
  return "[Robot name='" + this.name + "']";
};

Robot.prototype.log = function(level) {
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift("[" + this.name + "] -");
  Logger[level].apply(null, args);
};
