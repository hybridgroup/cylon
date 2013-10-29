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
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require("./robot");

  Port = require("./port");

  EventEmitter = require('events').EventEmitter;

  module.exports = Connection = (function(_super) {
    var klass;

    __extends(Connection, _super);

    klass = Connection;

    function Connection(opts) {
      if (opts == null) {
        opts = {};
      }
      this.connect = __bind(this.connect, this);
      this.self = this;
      this.robot = opts.robot;
      this.name = opts.name;
      this.adaptor = this.requireAdaptor(opts.adaptor);
      this.port = new Port(opts.port);
      proxyFunctionsToObject(this.adaptor.commands(), this.adaptor, klass);
    }

    Connection.prototype.connect = function(callback) {
      var msg;
      msg = "Connecting to '" + this.name + "'";
      if (this.port != null) {
        msg += " on port '" + (this.port.toString()) + "'";
      }
      Logger.info(msg);
      return this.adaptor.connect(callback);
    };

    Connection.prototype.disconnect = function() {
      var msg;
      msg = "Disconnecting from '" + this.name + "'";
      if (this.port != null) {
        msg += " on port '" + (this.port.toString()) + "'";
      }
      Logger.info(msg);
      return this.adaptor.disconnect();
    };

    Connection.prototype.requireAdaptor = function(adaptorName) {
      Logger.debug("Loading adaptor '" + adaptorName + "'");
      return this.robot.requireAdaptor(adaptorName, this.self);
    };

    return Connection;

  })(EventEmitter);

}).call(this);
