/*
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Async = require("async");

var Logger = require("./logger"),
    Robot = require("./robot"),
    Config = require("./config"),
    Utils = require("./utils");

var EventEmitter = require("events").EventEmitter;

var Cylon = module.exports = new EventEmitter();

Cylon.Logger = Logger;
Cylon.Driver = require("./driver");
Cylon.Adaptor = require("./adaptor");
Cylon.Utils = Utils;

Cylon.IO = {
  DigitalPin: require("./io/digital-pin"),
  Utils: require("./io/utils")
};

Cylon.apiInstances = [];

Cylon.robots = {};
Cylon.commands = {};

Cylon.events = [ "robot_added", "robot_removed" ];

// Public: Creates a new Robot
//
// opts - hash of Robot attributes
//
// Returns a shiny new Robot
// Examples:
//   Cylon.robot
//     connection: { name: "arduino", adaptor: "firmata" }
//     device: { name: "led", driver: "led", pin: 13 }
//
//     work: (me) ->
//       me.led.toggle()
Cylon.robot = function robot(opts) {
  opts = opts || {};

  // check if a robot with the same name exists already
  if (opts.name && this.robots[opts.name]) {
    var original = opts.name;
    opts.name = Utils.makeUnique(original, Object.keys(this.robots));

    var str = "Robot names must be unique. Renaming '";
    str += original + "' to '" + opts.name + "'";

    Logger.warn(str);
  }

  var bot = new Robot(opts);
  this.robots[bot.name] = bot;
  this.emit("robot_added", bot.name);

  return bot;
};

// Public: Initializes an API instance based on provided options.
//
// Returns nothing
Cylon.api = function api(Server, opts) {
  var isObject   = function(arg) { return typeof arg === "object"; },
      isFunction = function(arg) { return typeof arg === "function"; },
      isString   = function(arg) { return typeof arg === "string"; };

  // if only passed options (or nothing), assume HTTP server
  if (Server == null || isObject(Server) && !isFunction(Server)) {
    opts = Server;
    Server = "http";
  }

  opts = opts || {};

  if (isString(Server)) {
    var req = "cylon-api-" + Server;

    try {
      Server = require(req);
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        var messages;

        if (req === "cylon-api-http") {
          messages = [
            "The HTTP API is no longer included in Cylon by default.",
            "To use it, install the plugin module: `npm install cylon-api-http`"
          ];
        } else {
          messages = [
            "Cannot find the " + req + " API module.",
            "You may be able to install it: `npm install " + req + "`"
          ];
        }

        messages.forEach(function(str) {
          Logger.error(str);
        });
        return;
      } else {
        throw e;
      }
    }
  }

  opts.mcp = this;
  var instance = new Server(opts);
  this.apiInstances.push(instance);
  instance.start();
};

// Public: Starts up the API and the robots
//
// Returns nothing
Cylon.start = function start() {
  var starters = [],
      name;

  for (name in this.robots) {
    var bot = this.robots[name];
    starters.push(bot.start.bind(bot));
  }

  Async.parallel(starters, function() {
    var mode = Utils.fetch(Config, "workMode", "async");

    if (mode === "sync") {
      for (name in this.robots) {
        var bot = this.robots[name];
        bot.startWork.call(bot);
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
  var loggingChanged = (
    opts.logging && Config.logging !== Utils.merge(Config.logging, opts.logging)
  );

  if (typeof opts === "object" && !Array.isArray(opts)) {
    Config = Utils.merge(Config, opts);
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
  callback = callback || function() {};

  var fns = [];

  for (var name in this.robots) {
    var bot = this.robots[name];
    fns.push(bot.halt.bind(bot));
  }

  // if robots can"t shut down quickly enough, forcefully self-terminate
  var timeout = Config.haltTimeout || 3000;
  Utils.after(timeout, callback);

  Async.parallel(fns, callback);
};

Cylon.toJSON = function() {
  var robots = [];

  for (var name in this.robots) {
    var bot = this.robots[name];
    robots.push(bot.toJSON.call(bot));
  }

  return {
    robots: robots,
    commands: Object.keys(this.commands),
    events: this.events
  };
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
