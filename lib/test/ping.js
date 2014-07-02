/*
 * Ping driver
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Driver = require('../driver'),
    Utils = require('../utils');

var Ping;

module.exports = Ping = function Ping() {
  Ping.__super__.constructor.apply(this, arguments);
  this.commands = ['ping'];
};

Utils.subclass(Ping, Driver);

Ping.prototype.ping = function() {
  return "pong";
};

Ping.driver = function(opts) { return new Ping(opts); };
