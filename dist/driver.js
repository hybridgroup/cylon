/*
 * driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = require('node-namespace');

  namespace('Cylon.Drivers', function() {
    return this.Driver = (function(_super) {
      __extends(Driver, _super);

      function Driver(opts) {
        this.self = this;
        this.name = opts.name;
        this.device = opts.device;
      }

      Driver.prototype.start = function() {
        return Logger.info("Driver " + this.name + " started");
      };

      Driver.prototype.stop = function() {
        return Logger.info("Driver " + this.name + " stopped");
      };

      Driver.prototype.commands = function() {
        return [];
      };

      return Driver;

    })(Cylon.Basestar);
  });

  module.exports = Cylon.Drivers.Driver;

}).call(this);
