/*
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require('./cylon');
require('./basestar');
require("./connection");
require("./adaptor");
require("./device");
require("./driver");
require('./digital-pin');
var Async = require("async");
var EventEmitter = require('events').EventEmitter;

var namespace = require('node-namespace');

// A Robot is the primary interface for interacting with a collection of physical
// computing capabilities.
namespace("Cylon", function() {
  this.Robot = (function(klass) {
    subclass(Robot, klass);

    // Public: Creates a new Robot
    //
    // opts - object containing Robot options
    //   name - optional, string name of the robot
    //   master - Cylon.Master class that orchestrates robots
    //   connection/connections - object connections to connect to
    //   device/devices - object devices to connect to
    //   work - work to be performed when the Robot is started
    //
    // Returns a new Robot
    // Example (CoffeeScript):
    //    Cylon.robot
    //      name: "Spherobot!"
    //
    //      connection:
    //        name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'
    //
    //      device:
    //        name: 'sphero', driver: 'sphero'
    //
    //      work: (me) ->
    //        every 1.second(), ->
    //          me.sphero.roll 60, Math.floor(Math.random() * 360//
    function Robot(opts) {
      if (opts == null) { opts = {}; }

      var methods = [
        "toString",
        "registerDriver",
        "requireDriver",
        "registerAdaptor",
        "requireAdaptor",
        "stop",
        "startDevices",
        "startConnections",
        "start",
        "initDevices",
        "initConnections"
      ];

      for (var i = 0; i < methods.length ; i++) {
        var method = methods[i];
        this[method] = bind(this[method], this);
      }

      this.robot = this;
      this.name = opts.name || this.constructor.randomName();
      this.master = opts.master;

      this.connections = {};
      this.devices = {};
      this.adaptors = {};
      this.drivers = {};
      this.commands = [];

      this.running = false;

      this.registerAdaptor("./test/loopback", "loopback");
      this.registerAdaptor("./test/test-adaptor", "test");
      this.registerDriver("./test/ping", "ping");
      this.registerDriver("./test/test-driver", "test");

      this.initConnections(opts.connection || opts.connections);
      this.initDevices(opts.device || opts.devices);

      this.work = opts.work || function() { Logger.info("No work yet"); };

      for (var n in opts) {
        var func = opts[n],
            reserved = ['connection', 'connections', 'device', 'devices', 'work'];

        if (reserved.indexOf(n) < 0) { this.robot[n] = func; }
      }
    }

    // Public: Generates a random name for a Robot.
    //
    // Returns a string name
    Robot.randomName = function() {
      return "Robot " + (Math.floor(Math.random() * 100000));
    };

    // Public: Exports basic data for the Robot
    //
    // Returns an Object containing Robot data
    Robot.prototype.data = function() {
      var connection, device, n;
      return {
        name: this.name,
        connections: (function() {
          var _ref, _results;
          _ref = this.connections;
          _results = [];
          for (n in _ref) {
            connection = _ref[n];
            _results.push(connection.data());
          }
          return _results;
        }).call(this),
        devices: (function() {
          var _ref, _results;
          _ref = this.devices;
          _results = [];
          for (n in _ref) {
            device = _ref[n];
            _results.push(device.data());
          }
          return _results;
        }).call(this),
        commands: this.commands
      };
    };

    // Public: Initializes all connections for the robot
    //
    // connections - connections to initialize
    //
    // Returns initialized connections
    Robot.prototype.initConnections = function(connections) {
      var connection, _i, _len;
      Logger.info("Initializing connections...");
      if (connections == null) {
        return;
      }
      connections = [].concat(connections);
      for (_i = 0, _len = connections.length; _i < _len; _i++) {
        connection = connections[_i];
        Logger.info("Initializing connection '" + connection.name + "'...");
        connection['robot'] = this;
        this.connections[connection.name] = new Cylon.Connection(connection);
      }
      return this.connections;
    };

    // Public: Initializes all devices for the robot
    //
    // devices - devices to initialize
    //
    // Returns initialized devices
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
        _results.push(this.devices[device.name] = new Cylon.Device(device));
      }
      return _results;
    };

    // Public: Starts the Robot working.
    //
    // Starts the connections, devices, and work.
    //
    // Returns the result of the work
    Robot.prototype.start = function() {
      var _this = this;
      return this.startConnections(function() {
        return _this.robot.startDevices(function() {
          _this.robot.work.call(_this.robot, _this.robot);
          _this.running = true;
          Logger.info("Working...");
          return _this.robot.emit('working');
        });
      });
    };

    // Public: Starts the Robot's connections and triggers a callback
    //
    // callback - callback function to be triggered
    //
    // Returns nothing
    Robot.prototype.startConnections = function(callback) {
      var connection, n, starters, _ref;
      Logger.info("Starting connections...");
      starters = {};
      _ref = this.connections;
      for (n in _ref) {
        connection = _ref[n];
        this.robot[n] = connection;
        starters[n] = connection.connect;
      }
      return Async.parallel(starters, callback);
    };

    // Public: Starts the Robot's devices and triggers a callback
    //
    // callback - callback function to be triggered
    //
    // Returns nothing
    Robot.prototype.startDevices = function(callback) {
      var device, n, starters, _ref;
      Logger.info("Starting devices...");
      starters = {};
      _ref = this.devices;
      for (n in _ref) {
        device = _ref[n];
        this.robot[n] = device;
        starters[n] = device.start;
      }
      return Async.parallel(starters, callback);
    };

    // Public: Stops the Robot working.
    //
    // Stops the devices, disconnects the connections.
    //
    // Returns nothing
    Robot.prototype.stop = function() {
      var connection, device, n, _ref, _ref1, _results;
      _ref = this.devices;
      for (n in _ref) {
        device = _ref[n];
        device.stop();
      }
      _ref1 = this.connections;
      _results = [];
      for (n in _ref1) {
        connection = _ref1[n];
        _results.push(connection.disconnect());
      }
      return _results;
    };

    // Public: Initialize an adaptor and adds it to @robot.adaptors
    //
    // adaptorName - module name of adaptor to require
    // connection - the Connection that requested the adaptor be required
    //
    // Returns the adaptor
    Robot.prototype.initAdaptor = function(adaptorName, connection, opts) {
      var realAdaptor, testAdaptor;
      if (opts == null) {
        opts = {};
      }
      realAdaptor = this.robot.requireAdaptor(adaptorName).adaptor({
        name: adaptorName,
        connection: connection,
        extraParams: opts
      });
      if (CylonConfig.testing_mode) {
        testAdaptor = this.robot.requireAdaptor('test').adaptor({
          name: adaptorName,
          connection: connection,
          extraParams: opts
        });
        return proxyTestStubs(realAdaptor.commands(), testAdaptor);
      } else {
        return realAdaptor;
      }
    };

    // Public: Requires a hardware adaptor and adds it to @robot.adaptors
    //
    // adaptorName - module name of adaptor to require
    //
    // Returns the module for the adaptor
    Robot.prototype.requireAdaptor = function(adaptorName) {
      if (this.robot.adaptors[adaptorName] == null) {
        this.robot.registerAdaptor("cylon-" + adaptorName, adaptorName);
        this.robot.adaptors[adaptorName].register(this);
      }
      return this.robot.adaptors[adaptorName];
    };

    // Public: Registers an Adaptor with the Robot
    //
    // moduleName - name of the Node module to require
    // adaptorName - name of the adaptor to register the moduleName under
    //
    // Returns the registered module name
    Robot.prototype.registerAdaptor = function(moduleName, adaptorName) {
      if (this.adaptors[adaptorName] == null) {
        return this.adaptors[adaptorName] = require(moduleName);
      }
    };

    // Public: Init a hardware driver
    //
    // driverName - driver name
    // device - the Device that requested the driver be initialized
    // opts - object containing options when initializing driver
    //
    // Returns the new driver
    Robot.prototype.initDriver = function(driverName, device, opts) {
      var realDriver, testDriver;
      if (opts == null) {
        opts = {};
      }
      realDriver = this.robot.requireDriver(driverName).driver({
        name: driverName,
        device: device,
        extraParams: opts
      });
      if (CylonConfig.testing_mode) {
        testDriver = this.robot.requireDriver('test').driver({
          name: driverName,
          device: device,
          extraParams: opts
        });
        return proxyTestStubs(realDriver.commands(), testDriver);
      } else {
        return realDriver;
      }
    };

    // Public: Requires module for a driver and adds it to @robot.drivers
    //
    // driverName - module name of driver to require
    //
    // Returns the module for driver
    Robot.prototype.requireDriver = function(driverName) {
      if (this.robot.drivers[driverName] == null) {
        this.robot.registerDriver("cylon-" + driverName, driverName);
        this.robot.drivers[driverName].register(this);
      }
      return this.robot.drivers[driverName];
    };

    // Public: Registers an Driver with the Robot
    //
    // moduleName - name of the Node module to require
    // driverName - name of the driver to register the moduleName under
    //
    // Returns the registered module nam//
    Robot.prototype.registerDriver = function(moduleName, driverName) {
      if (this.drivers[driverName] == null) {
        return this.drivers[driverName] = require(moduleName);
      }
    };

    // Public: Returns basic info about the robot as a String
    //
    // Returns a String
    Robot.prototype.toString = function() {
      return "[Robot name='" + this.name + "']";
    };

    return Robot;

  })(EventEmitter);
});

module.exports = Cylon.Robot;
