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
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

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
      this.addCommands(this.driver);
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

    Device.prototype.addCommands = function(object) {
      var method, _i, _len, _ref, _results;
      _ref = object.commands();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        _results.push(this.addProxy(object, method));
      }
      return _results;
    };

    Device.prototype.addProxy = function(object, method) {
      return this.self[method] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return object[method].apply(object, args);
      };
    };

    return Device;

  })(EventEmitter);

}).call(this);
