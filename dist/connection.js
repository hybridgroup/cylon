/*
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Connection, EventEmitter, Port,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  require("./robot");

  Port = require("./port");

  EventEmitter = require('events').EventEmitter;

  module.exports = Connection = (function(_super) {
    __extends(Connection, _super);

    function Connection(opts) {
      if (opts == null) {
        opts = {};
      }
      this.self = this;
      this.robot = opts.robot;
      this.name = opts.name;
      this.adaptor = this.requireAdaptor(opts.adaptor);
      this.addCommands(this.adaptor);
      this.port = new Port(opts.port);
    }

    Connection.prototype.connect = function(callback) {
      Logger.info("Connecting to '" + this.name + "' on port '" + (this.port.toString()) + "'...");
      return this.adaptor.connect(callback);
    };

    Connection.prototype.disconnect = function() {
      Logger.info("Disconnecting from '" + this.name + "' on port '" + (this.port.toString()) + "'...");
      return this.adaptor.disconnect();
    };

    Connection.prototype.requireAdaptor = function(adaptorName) {
      Logger.debug("Loading adaptor '" + adaptorName + "'");
      return this.robot.requireAdaptor(adaptorName, this.self);
    };

    Connection.prototype.addCommands = function(object) {
      var method, _i, _len, _ref, _results;
      _ref = object.commands();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        _results.push(this.addProxy(object, method));
      }
      return _results;
    };

    Connection.prototype.addProxy = function(object, method) {
      return this[method] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return object[method].apply(object, args);
      };
    };

    return Connection;

  })(EventEmitter);

}).call(this);
