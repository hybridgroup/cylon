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
      this.self = this;
      this.robot = opts.robot;
      this.name = opts.name;
      this.adaptor = this.requireAdaptor(opts.adaptor);
      this.port = new Port(opts.port);
      proxyFunctionsToObject(this.adaptor.commands(), this.adaptor, klass);
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

    return Connection;

  })(EventEmitter);

}).call(this);
