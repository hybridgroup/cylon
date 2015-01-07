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
    _ = require("./lodash");

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

  _.forEach(opts, function(opt, name) {
    if (_.include(["robot", "name", "adaptor", "events"], name)) {
      return;
    }

    this.details[name] = opt;
  }, this);
};

Utils.subclass(Adaptor, Basestar);

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
