/*
 * Loopback adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Adaptor = require('../adaptor');

var Loopback;

module.exports = Loopback = function Loopback() {
  Loopback.__super__.constructor.apply(this, arguments);
};

subclass(Loopback, Adaptor);

Loopback.prototype.commands = function() {
  return ['ping'];
};

Loopback.adaptor = function(opts) { return new Loopback(opts); };
