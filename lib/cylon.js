/*
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Async = require('async');

var Logger = require('./logger'),
    Robot = require('./robot'),
    Config = require('./config'),
    Utils = require('./utils');

var Cylon = module.exports = {
  Logger: Logger,
  Driver: require('./driver'),
  Adaptor: require('./adaptor'),
  Utils: Utils,

  IO: {
    DigitalPin: require('./io/digital-pin'),
    Utils: require('./io/utils')
  },

  api_instance: null,

  robots: {},
  commands: {}
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
  opts = opts || {};

  // check if a robot with the same name exists already
  if (opts.name && this.robots[opts.name]) {
    var original = opts.name;
    opts.name = Utils.makeUnique(original, Object.keys(this.robots));
    Logger.warn("Robot names must be unique. Renaming '" + original + "' to '" + opts.name + "'");
  }

  var robot = new Robot(opts);
  this.robots[robot.name] = robot;
  return robot;
};

// Public: Creates a new API based on passed options
//
// Returns nothing
Cylon.api = function api(opts) {
  if (typeof opts === 'object') {
    this.config({ api: opts });
  }

  var API = require('./api');

  var config = Utils.fetch(Config, 'api', {});

  this.api_instance = new API(config);
  this.api_instance.listen();
};

// Public: Starts up the API and the robots
//
// Returns nothing
Cylon.start = function start() {
  var starters = [];
  for (var bot in this.robots) {
    starters.push(this.robots[bot].start);
  }
  Async.parallel(starters, function(err, results) {
    var mode = Utils.fetch(Config, 'workMode', 'async');
    if (mode === 'sync') {
      for (var bot in this.robots) {
        this.robots[bot].startWork();
      }
     }
  }.bind(this));
};

// Public: Sets the internal configuration, based on passed options
//
// opts - object containing configuration key/value pairs
//
// Returns the current config
Cylon.config = function(opts) {
  var loggingChanged = (opts.logging && Config.logging !== opts.logging);

  if (opts && typeof(opts) === 'object' && !Array.isArray(opts)) {
    for (var o in opts) {
      Config[o] = opts[o];
    }
  }

  if (loggingChanged) {
    Logger.setup();
  }

  return Config;
};

// Public: Halts the API and the robots
//
// callback - callback to be triggered when Cylon is ready to shutdown
//
// Returns nothing
Cylon.halt = function halt(callback) {
  callback = callback || function() {}
  // if robots can't shut down quickly enough, forcefully self-terminate
  var timeout = Config.haltTimeout || 3000
  Utils.after(timeout, callback);

  var fns = [];

  for (var bot in this.robots) {
    var robot = this.robots[bot];
    fns.push(robot.halt.bind(robot));
  }

  Async.parallel(fns, callback);
};

Cylon.toJSON = function() {
  var robots = [];

  for (var bot in this.robots) {
    robots.push(this.robots[bot].toJSON());
  }

  return {
    robots: robots,
    commands: Object.keys(this.commands)
  }
};

if (process.platform === "win32") {
  var readline = require("readline"),
      io = { input: process.stdin, output: process.stdout };

  readline.createInterface(io).on("SIGINT", function() {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function() {
  Cylon.halt(function() {
    process.kill(process.pid);
  });
});
