/*
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Device, EventEmitter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('./cylon');

  EventEmitter = require('events').EventEmitter;

  module.exports = Device = (function(_super) {
    __extends(Device, _super);

    function Device(opts) {
      if (opts == null) {
        opts = {};
      }
      this.self = this;
      this.robot = opts.robot;
      this.name = opts.name;
      this.pin = opts.pin;
      this.connection = this.determineConnection(opts.connection) || this.defaultConnection();
      this.driver = this.requireDriver(opts.driver);
      proxyFunctionsToObject(this.driver.commands(), this.driver, this);
    }

    Device.prototype.start = function(callback) {
      var msg;
      msg = "Starting device '" + this.name + "'";
      if (this.pin != null) {
        msg += " on pin " + this.pin;
      }
      Logger.info(msg);
      return this.driver.start(callback);
    };

    Device.prototype.determineConnection = function(c) {
      if (c) {
        return this.robot.connections[c];
      }
    };

    Device.prototype.defaultConnection = function() {
      var first, k, v, _ref;
      first = 0;
      _ref = this.robot.connections;
      for (k in _ref) {
        v = _ref[k];
        first || (first = v);
      }
      return first;
    };

    Device.prototype.requireDriver = function(driverName) {
      Logger.debug("Loading driver '" + driverName + "'");
      return this.robot.requireDriver(driverName, this.self);
    };

    return Device;

  })(EventEmitter);

}).call(this);
