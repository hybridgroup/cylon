/*
 * adaptor
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
  return ["Error in connection", "'" + name + "'", "- " + message].join(" ");
}

// Public: Creates a new Adaptor
//
// opts - hash of acceptable params
//   name - name of the Adaptor, used when printing to console
//   connection - Connection the adaptor will use to proxy commands/events
//
// Returns a new Adaptor
var Adaptor = module.exports = function Adaptor(opts) {
  opts = opts || {};

  this.name = opts.name;

  // the Robot the adaptor belongs to
  this.robot = opts.robot;

  // some default options
  this.host = opts.host;
  this.port = opts.port;

  // misc. details provided in args hash
  this.details = {};

  _.each(opts, function(opt, name) {
    if (!_.includes(["robot", "name", "adaptor", "events"], name)) {
      this.details[name] = opt;
    }
  }, this);
};

Utils.subclass(Adaptor, Basestar);

// Public: Basic #connect function. Must be overwritten by a descendent class
//
// Returns nothing, throws an error
Adaptor.prototype.connect = function() {
  var message = formatErrorMessage(
    this.name,
    "Adaptor#connect method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

// Public: Basic #disconnect function. Must be overwritten by a descendent class
//
// Returns nothing, throws an error
Adaptor.prototype.disconnect = function() {
  var message = formatErrorMessage(
    this.name,
    "Adaptor#disconnect method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

// Public: Expresses the Connection in JSON format
//
// Returns an Object containing Connection data
Adaptor.prototype.toJSON = function() {
  return {
    name: this.name,
    adaptor: this.constructor.name || this.name,
    details: this.details
  };
};
