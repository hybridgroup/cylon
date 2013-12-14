/*
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var EventEmitter, namespace,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('./cylon');

  require('./driver');

  namespace = require('node-namespace');

  EventEmitter = require('events').EventEmitter;

  namespace('Cylon', function() {
    return this.Device = (function(_super) {
      __extends(Device, _super);

      function Device(opts) {
        if (opts == null) {
          opts = {};
        }
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.self = this;
        this.robot = opts.robot;
        this.name = opts.name;
        this.pin = opts.pin;
        this.connection = this.determineConnection(opts.connection) || this.defaultConnection();
        this.driver = this.initDriver(opts);
        proxyFunctionsToObject(this.driver.commands(), this.driver, this.self);
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

      Device.prototype.stop = function() {
        Logger.info("Stopping device '" + this.name + "'");
        return this.driver.stop();
      };

      Device.prototype.data = function() {
        return {
          name: this.name,
          driver: this.driver.constructor.name || this.driver.name,
          pin: this.pin != null ? this.pin.toString : null,
          connection: this.connection.data(),
          commands: this.driver.commands()
        };
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

      Device.prototype.initDriver = function(opts) {
        if (opts == null) {
          opts = {};
        }
        Logger.debug("Loading driver '" + opts.driver + "'");
        return this.robot.initDriver(opts.driver, this.self, opts);
      };

      return Device;

    })(EventEmitter);
  });

  module.exports = Cylon.Device;

}).call(this);
