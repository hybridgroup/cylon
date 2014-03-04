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


// The Connection class represents the interface to
// a specific group of hardware devices. Examples would be an
// Arduino, a Sphero, or an ARDrone.
namespace("Cylon", function() {
  this.Connection = (function(klass) {
    subclass(Connection, klass);

    // Public: Creates a new Connection
    //
    // opts - hash of acceptable params:
    //   id - string ID for the connection
    //   robot - Robot the Connection belongs to
    //   name - name for the connection
    //   adaptor - string module name of the adaptor to be set up
    //   port - string port to use for the Connection
    //
    // Returns the newly set-up connection
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
      this.port = new Cylon.Port(opts.port);
      this.adaptor = this.initAdaptor(opts);
      proxyFunctionsToObject(this.adaptor.commands(), this.adaptor, this.self);
    }

    // Public: Exports basic data for the Connection
    //
    // Returns an Object containing Connection data
    Connection.prototype.data = function() {
      return {
        name: this.name,
        port: this.port.toString(),
        adaptor: this.adaptor.constructor.name || this.adaptor.name,
        connection_id: this.connection_id
      };
    };

    // Public: Connect the adaptor's connection
    //
    // callback - callback function to run when the adaptor is connected
    //
    // Returns the result of the supplied callback function
    Connection.prototype.connect = function(callback) {
      var msg;
      msg = "Connecting to '" + this.name + "'";
      if (this.port != null) {
        msg += " on port '" + (this.port.toString()) + "'";
      }
      Logger.info(msg);
      return this.adaptor.connect(callback);
    };

    // Public: Disconnect the adaptor's connection
    //
    // Returns nothing
    Connection.prototype.disconnect = function() {
      var msg;
      msg = "Disconnecting from '" + this.name + "'";
      if (this.port != null) {
        msg += " on port '" + (this.port.toString()) + "'";
      }
      Logger.info(msg);
      return this.adaptor.disconnect();
    };

    // Public: sets up adaptor with @robot
    //
    // opts - options for adaptor being initialized
    //   adaptor - name of the adaptor
    //
    // Returns the set-up adaptor
    Connection.prototype.initAdaptor = function(opts) {
      Logger.debug("Loading adaptor '" + opts.adaptor + "'");
      return this.robot.initAdaptor(opts.adaptor, this.self, opts);
    };

    // Public: Stop the adaptor's connection
    //
    // Returns nothing
    Connection.prototype.stop = function() {
      var msg;
      msg = "Stopping adaptor '" + this.name + "'";
      if (this.port != null) {
        msg += " on port '" + (this.port.toString()) + "'";
      }
      Logger.info(msg);
      return this.disconnect();
    };

    return Connection;

  })(EventEmitter);
});

module.exports = Cylon.Connection;
