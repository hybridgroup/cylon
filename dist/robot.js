/*
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Connection, Device, Robot,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  require('./cylon');

  Connection = require("./connection");

  Device = require("./device");

  module.exports = Robot = (function() {
    var self,
      _this = this;

    self = Robot;

    Robot.adaptors = {};

    Robot.drivers = {};

    function Robot(opts) {
      if (opts == null) {
        opts = {};
      }
      this.startDevices = __bind(this.startDevices, this);
      this.startConnections = __bind(this.startConnections, this);
      this.start = __bind(this.start, this);
      this.initDevices = __bind(this.initDevices, this);
      this.initConnections = __bind(this.initConnections, this);
      this.name = opts.name || this.constructor.randomName();
      this.master = opts.master;
      this.connections = {};
      this.devices = {};
      this.registerAdaptor("./loopback", "loopback");
      this.initConnections(opts.connection || opts.connections);
      this.initDevices(opts.device || opts.devices);
      this.work = opts.work || function() {
        return Logger.info("No work yet");
      };
    }

    Robot.randomName = function() {
      return "Robot " + (Math.floor(Math.random() * 100000));
    };

    Robot.prototype.initConnections = function(connections) {
      var connection, _i, _len, _results;
      Logger.info("Initializing connections...");
      if (connections == null) {
        return;
      }
      connections = [].concat(connections);
      _results = [];
      for (_i = 0, _len = connections.length; _i < _len; _i++) {
        connection = connections[_i];
        Logger.info("Initializing connection '" + connection.name + "'...");
        connection['robot'] = this;
        _results.push(this.connections[connection.name] = new Connection(connection));
      }
      return _results;
    };

    Robot.prototype.initDevices = function(devices) {
      var device, _i, _len, _results;
      Logger.info("Initializing devices...");
      if (devices == null) {
        return;
      }
      devices = [].concat(devices);
      _results = [];
      for (_i = 0, _len = devices.length; _i < _len; _i++) {
        device = devices[_i];
        Logger.info("Initializing device '" + device.name + "'...");
        device['robot'] = this;
        _results.push(this.devices[device.name] = new Device(device));
      }
      return _results;
    };

    Robot.prototype.start = function() {
      this.startConnections();
      this.startDevices();
      return this.work.call(self, this);
    };

    Robot.prototype.startConnections = function() {
      var connection, n, _ref, _results;
      Logger.info("Starting connections...");
      _ref = this.connections;
      _results = [];
      for (n in _ref) {
        connection = _ref[n];
        Logger.info("Starting connection '" + connection.name + "'...");
        _results.push(connection.connect());
      }
      return _results;
    };

    Robot.prototype.startDevices = function() {
      var device, n, _ref, _results;
      Logger.info("Starting devices...");
      _ref = this.devices;
      _results = [];
      for (n in _ref) {
        device = _ref[n];
        Logger.info("Starting device '" + device.name + "'...");
        device.start();
        _results.push(this[device.name] = device);
      }
      return _results;
    };

    Robot.requireAdaptor = function(adaptorName, connection) {
      if (Robot.adaptors[adaptorName] != null) {
        if (typeof Robot.adaptors[adaptorName] === 'string') {
          Robot.adaptors[adaptorName] = require(Robot.adaptors[adaptorName]).adaptor({
            name: adaptorName,
            connection: connection
          });
        }
      } else {
        require("cylon-" + adaptorName).register(Robot);
        Robot.adaptors[adaptorName] = require("cylon-" + adaptorName).adaptor({
          name: adaptorName,
          connection: connection
        });
      }
      return Robot.adaptors[adaptorName];
    };

    Robot.prototype.requireAdaptor = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return self.requireAdaptor.apply(self, args);
    };

    Robot.registerAdaptor = function(moduleName, adaptorName) {
      if (self.adaptors[adaptorName] != null) {
        return;
      }
      return self.adaptors[adaptorName] = moduleName;
    };

    Robot.prototype.registerAdaptor = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return self.registerAdaptor.apply(self, args);
    };

    Robot.requireDriver = function(driverName, device) {
      if (Robot.drivers[driverName] != null) {
        if (typeof Robot.drivers[driverName] === 'string') {
          Robot.drivers[driverName] = require(Robot.drivers[driverName]).driver({
            device: device
          });
        }
      } else {
        require("cylon-" + driverName).register(Robot);
        Robot.drivers[driverName] = require("cylon-" + driverName).driver({
          device: device
        });
      }
      return Robot.drivers[driverName];
    };

    Robot.prototype.requireDriver = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return self.requireDriver.apply(self, args);
    };

    Robot.registerDriver = function(moduleName, driverName) {
      if (self.drivers[driverName] != null) {
        return;
      }
      return self.drivers[driverName] = moduleName;
    };

    Robot.prototype.registerDriver = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return self.registerDriver.apply(self, args);
    };

    return Robot;

  }).call(this);

}).call(this);
