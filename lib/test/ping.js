/*
 * Ping driver
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Driver = require("../driver"),
    Utils = require("../utils");

var Ping = module.exports = function Ping() {
  Ping.__super__.constructor.apply(this, arguments);

  this.commands = {
    ping: this.ping
  };

  this.events = ["ping"];
};

Utils.subclass(Ping, Driver);

Ping.prototype.ping = function() {
  this.emit("ping", "ping");
  return "pong";
};

Ping.prototype.start = function(callback) {
  callback();
};

Ping.prototype.halt = function(callback) {
  callback();
};

Ping.drivers = ["ping"];
Ping.driver = function(opts) { return new Ping(opts); };
