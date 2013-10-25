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
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require('./cylon');

  Connection = require("./connection");

  Device = require("./device");

  module.exports = Robot = (function() {
    var self;

    self = Robot;

    function Robot(opts) {
      if (opts == null) {
        opts = {};
      }
      this.registerDriver = __bind(this.registerDriver, this);
      this.startDevices = __bind(this.startDevices, this);
      this.startConnections = __bind(this.startConnections, this);
      this.start = __bind(this.start, this);
      this.initDevices = __bind(this.initDevices, this);
      this.initConnections = __bind(this.initConnections, this);
      this.robot = this;
      this.name = opts.name || this.constructor.randomName();
      this.master = opts.master;
      this.connections = {};
      this.devices = {};
      this.adaptors = {};
      this.drivers = {};
      this.registerAdaptor("./loopback", "loopback");
      this.registerDriver("./ping", "ping");
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
      return this.work.call(this.robot, this.robot);
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
        _results.push(this[device.name] = device);
      }
      return _results;
    };

    Robot.prototype.requireAdaptor = function(adaptorName, connection) {
      if (this.robot.adaptors[adaptorName] != null) {
        if (typeof this.robot.adaptors[adaptorName] === 'string') {
          this.robot.adaptors[adaptorName] = require(this.robot.adaptors[adaptorName]).adaptor({
            name: adaptorName,
            connection: connection
          });
        }
      } else {
        require("cylon-" + adaptorName).register(this);
        this.robot.adaptors[adaptorName] = require("cylon-" + adaptorName).adaptor({
          name: adaptorName,
          connection: connection
        });
      }
      return this.robot.adaptors[adaptorName];
    };

    Robot.prototype.registerAdaptor = function(moduleName, adaptorName) {
      if (this.adaptors[adaptorName] != null) {
        return;
      }
      return this.adaptors[adaptorName] = moduleName;
    };

    Robot.prototype.requireDriver = function(driverName, device) {
      if (this.robot.drivers[driverName] != null) {
        if (typeof this.robot.drivers[driverName] === 'string') {
          this.robot.drivers[driverName] = require(this.robot.drivers[driverName]).driver({
            device: device
          });
        }
      } else {
        require("cylon-" + driverName).register(this);
        this.robot.drivers[driverName] = require("cylon-" + driverName).driver({
          device: device
        });
      }
      return this.robot.drivers[driverName];
    };

    Robot.prototype.registerDriver = function(moduleName, driverName) {
      if (this.drivers[driverName] != null) {
        return;
      }
      return this.drivers[driverName] = moduleName;
    };

    return Robot;

  })();

}).call(this);
