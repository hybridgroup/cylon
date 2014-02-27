/*
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require("./robot");
require("./port");
require("./adaptor");
var namespace = require('node-namespace');
var EventEmitter = require('events').EventEmitter;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }

namespace("Cylon", function() {
  this.Connection = (function(klass) {
    subclass(Connection, klass);

    function Connection(opts) {
      if (opts == null) {
        opts = {};
      }
      this.connect = __bind(this.connect, this);
      if (opts.id == null) {
        opts.id = Math.floor(Math.random() * 10000);
      }
      this.self = this;
      this.robot = opts.robot;
      this.name = opts.name;
      this.connection_id = opts.id;
      this.adaptor = this.initAdaptor(opts);
      this.port = new Cylon.Port(opts.port);
      proxyFunctionsToObject(this.adaptor.commands(), this.adaptor, this.self);
    }

    Connection.prototype.data = function() {
      return {
        name: this.name,
        port: this.port.toString(),
        adaptor: this.adaptor.constructor.name || this.adaptor.name,
        connection_id: this.connection_id
      };
    };

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

    Connection.prototype.initAdaptor = function(opts) {
      Logger.debug("Loading adaptor '" + opts.adaptor + "'");
      return this.robot.initAdaptor(opts.adaptor, this.self, opts);
    };

    return Connection;

  })(EventEmitter);
});

module.exports = Cylon.Connection;
