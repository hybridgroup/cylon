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

  require('./basestar');

  namespace('Cylon', function() {
    return this.Driver = (function(_super) {
      __extends(Driver, _super);

      function Driver(opts) {
        if (opts == null) {
          opts = {};
        }
        this.self = this;
        this.name = opts.name;
        this.device = opts.device;
        this.connection = this.device.connection;
      }

      Driver.prototype.start = function(callback) {
        Logger.info("Driver " + this.name + " started");
        callback(null);
        this.device.emit('start');
        return true;
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

}).call(this);
