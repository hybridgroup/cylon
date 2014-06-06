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

  robots: {}
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
  var robot = new Robot(opts);
  this.robots[robot.name] = robot;
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

// Public: Starts up the API and the robots
//
// Returns nothing
Cylon.start = function start() {
  for (var bot in this.robots) {
    this.robots[bot].start();
  }
};

// Public: Halts the API and the robots
//
// Returns nothing
Cylon.halt = function halt() {
  for (var bot in this.robots) {
    this.robots[bot].halt();
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
