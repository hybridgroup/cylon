/*
 * driver
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Basestar = require("./basestar"),
    Utils = require("./utils"),
    _ = require("./utils/helpers");

function formatErrorMessage(name, message) {
  return ["Error in driver", "'" + name + "'", "- " + message].join(" ");
}

// Public: Creates a new Driver
//
// opts - hash of acceptable params
//   name - name of the Driver, used when printing to console
//   device - Device the driver will use to proxy commands/events
//
// Returns a new Driver
var Driver = module.exports = function Driver(opts) {
  opts = opts || {};

  this.name = opts.name;
  this.robot = opts.robot;

  this.connection = opts.connection;

  this.commands = {};
  this.events = [];

  // some default options
  this.pin = opts.pin;
  this.interval = opts.interval || 10;

  this.details = {};

  _.each(opts, function(opt, name) {
    var banned = ["robot", "name", "connection", "driver", "events"];

    if (!_.includes(banned, name)) {
      this.details[name] = opt;
    }
  }, this);
};

Utils.subclass(Driver, Basestar);

// Public: Basic #start function. Must be overwritten by a descendent class
//
// Returns nothing, throws an error
Driver.prototype.start = function() {
  var message = formatErrorMessage(
    this.name,
    "Driver#start method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

// Public: Basic #halt function. Must be overwritten by a descendent class
//
// Returns nothing, throws an error
Driver.prototype.halt = function() {
  var message = formatErrorMessage(
    this.name,
    "Driver#halt method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

Driver.prototype.setupCommands = function(commands, proxy) {
  if (proxy == null) {
    proxy = this.connection;
  }

  Utils.proxyFunctionsToObject(commands, proxy, this);

  commands.forEach(function(command) {
    var snake_case = command.replace(/[A-Z]+/g, function(match) {
      if (match.length > 1) {
        match = match.replace(/[A-Z]$/, function(m) {
          return "_" + m.toLowerCase();
        });
      }

      return "_" + match.toLowerCase();
    }).replace(/^_/, "");

    this.commands[snake_case] = this[command];
  }, this);
};

Driver.prototype.toJSON = function() {
  return {
    name: this.name,
    driver: this.constructor.name || this.name,
    connection: this.connection.name,
    commands: Object.keys(this.commands),
    events: this.events,
    details: this.details
  };
};
