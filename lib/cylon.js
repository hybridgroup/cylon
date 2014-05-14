/*
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Robot = require('./robot'),
    Utils = require('./utils');

require('./logger');

Logger.setup();

var Cylon = module.exports = {
  Driver: require('./driver'),
  Adaptor: require('./adaptor'),

  IO: {
    DigitalPin: require('./io/digital-pin')
  },

  api_instance: null,

  robots: [],

  api_config: {
    host: '127.0.0.1',
    port: '3000',
    auth: {},
    CORS: null,
    ssl: {}
  }
};

// Public: Creates a new Robot
//
// opts - hash of Robot attributes
//
// Returns a shiny new Robot
// Examples:
//   Cylon.robot
//     connection: { name: 'arduino', adaptor: 'firmata' }
//     device: { name: 'led', driver: 'led', pin: 13 }
//
//     work: (me) ->
//       me.led.toggle()
Cylon.robot = function robot(opts) {
  opts.master = this;
  var robot = new Robot(opts);
  this.robots.push(robot);
  return robot;
};

// Public: Configures the API host and port based on passed options
//
// opts - object containing API options
//   host - host address API should serve from
//   port - port API should listen for requests on
//
// Returns the API configuration
Cylon.api = function api(opts) {
  if (opts == null) {
    opts = {};
  }

  var keys = ['host', 'port', 'auth', 'CORS', 'ssl'];

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (typeof opts[key] !== "undefined") {
      this.api_config[key] = opts[key];
    }
  }

  return this.api_config;
};

// Public: Finds a particular robot by name
//
// name - name of the robot to find
// callback - optional callback to be executed
//
// Returns the found Robot or result of the callback if it's supplied
Cylon.findRobot = function findRobot(name, callback) {
  var error,
      robot = null;

  for (var i = 0; i < this.robots.length; i++) {
    var bot = this.robots[i];
    if (bot.name === name) { robot = bot; }
  }

  if (robot == null) {
    error = { error: "No Robot found with the name " + name };
  }

  return callback ? callback(error, robot) : robot;
};

// Public: Finds a particular Robot's device by name
//
// robotid - name of the robot to find
// deviceid - name of the device to find
// callback - optional callback to be executed
//
// Returns the found Device or result of the callback if it's supplied
Cylon.findRobotDevice = function findRobotDevice(robotid, deviceid, callback) {
  return this.findRobot(robotid, function(err, robot) {
    var error,
        device = null;

    if (err) { return callback ? callback(err, robot) : robot }

    if (robot.devices[deviceid]) { device = robot.devices[deviceid]; }

    if (device == null) {
      error = { error: "No device found with the name " + deviceid + "." };
    }

    return callback ? callback(error, device) : device;
  });
};

// Public: Finds a particular Robot's connection by name
//
// robotid - name of the robot to find
// connid - name of the device to find
// callback - optional callback to be executed
//
// Returns the found Connection or result of the callback if it's supplied
Cylon.findRobotConnection = function findRobotConnection(robotid, connid, callback) {
  return this.findRobot(robotid, function(err, robot) {
    var error,
        connection = null;

    if (err) { return callback ? callback(err, robot) : robot }

    if (robot.connections[connid]) { connection = robot.connections[connid]; }

    if (connection == null) {
      error = { error: "No connection found with the name " + connid + "." };
    }

    return callback ? callback(error, connection) : connection;
  });
};

// Public: Starts up the API and the robots
//
// Returns nothing
Cylon.start = function start() {
  this.startAPI();

  for (var i = 0; i < this.robots.length; i++) {
    var robot = this.robots[i];
    robot.start();
  }
};

// Public: Halts the API and the robots
//
// Returns nothing
Cylon.halt = function halt() {
  for (var i = 0; i < this.robots.length; i++) {
    var robot = this.robots[i];
    robot.halt();
  }
};

// Creates a new instance of the Cylon API server, or returns the
// already-existing one.
//
// Returns an Cylon.ApiServer instance
Cylon.startAPI = function startAPI() {
  var API = require('./api');
  this.api_config.master = this;

  if (this.api_instance === null) {
    this.api_instance = new API(this.api_config);
    this.api_instance.configureRoutes();
    this.api_instance.listen();
  }

  return this.api_instance;
};

if (process.platform === "win32") {
  var readline = require("readline"),
      io = { input: process.stdin, output: process.stdout };

  readline.createInterface(io).on("SIGINT", function() {
    process.emit("SIGINT");
  });
};

process.on("SIGINT", function() {
  Cylon.halt();
  process.kill(process.pid);
});
