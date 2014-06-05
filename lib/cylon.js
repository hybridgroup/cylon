/*
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var API = require('./api'),
    Logger = require('./logger'),
    Robot = require('./robot'),
    Utils = require('./utils');

Logger.setup();

var Cylon = module.exports = {
  Logger: Logger,
  Driver: require('./driver'),
  Adaptor: require('./adaptor'),
  Utils: Utils,

  IO: {
    DigitalPin: require('./io/digital-pin')
  },

  api_instance: null,

  robots: []
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

// Public: Creates a new API based on passed options
//
// opts - object containing API options
//
// Returns nothing
Cylon.api = function api(opts) {
  if (opts == null) {
    opts = {};
  }

  this.api_instance = new API(opts);
  this.api_instance.listen();
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
