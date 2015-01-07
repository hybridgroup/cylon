/*
 * Loopback adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Adaptor = require("../adaptor"),
    Utils = require("../utils");

var Loopback;

module.exports = Loopback = function Loopback() {
  Loopback.__super__.constructor.apply(this, arguments);
};

Utils.subclass(Loopback, Adaptor);

Loopback.prototype.connect = function(callback) {
  callback();
};

Loopback.prototype.disconnect = function(callback) {
  callback();
};

Loopback.adaptors = ["loopback"];
Loopback.adaptor = function(opts) { return new Loopback(opts); };
