/*
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Async, EventEmitter, namespace,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  require('./cylon');

  require('./basestar');

  require("./connection");

  require("./adaptor");

  require("./device");

  require("./driver");

  require('./digital-pin');

  namespace = require('node-namespace');

  Async = require("async");

  EventEmitter = require('events').EventEmitter;

  namespace('Cylon', function() {
    return this.Robot = (function(_super) {
      var klass;

      __extends(Robot, _super);

      klass = Robot;

      function Robot(opts) {
        var func, n, reserved;
        if (opts == null) {
          opts = {};
        }
        this.toString = __bind(this.toString, this);
        this.registerDriver = __bind(this.registerDriver, this);
        this.requireDriver = __bind(this.requireDriver, this);
        this.registerAdaptor = __bind(this.registerAdaptor, this);
        this.requireAdaptor = __bind(this.requireAdaptor, this);
        this.stop = __bind(this.stop, this);
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
        this.commands = [];
        this.running = false;
        this.registerAdaptor("./test/loopback", "loopback");
        this.registerAdaptor("./test/test-adaptor", "test");
        this.registerDriver("./test/ping", "ping");
        this.registerDriver("./test/test-driver", "test");
        this.testing = process.env['CYLON_TEST'];
        this.initConnections(opts.connection || opts.connections);
        this.initDevices(opts.device || opts.devices);
        this.work = opts.work || function() {
          return Logger.info("No work yet");
        };
        for (n in opts) {
          func = opts[n];
          reserved = ['connection', 'connections', 'device', 'devices', 'work'];
          if (__indexOf.call(reserved, n) < 0) {
            this.robot[n] = func;
          }
        }
      }

      Robot.randomName = function() {
        return "Robot " + (Math.floor(Math.random() * 100000));
      };

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

      Robot.prototype.startConnections = function(callback) {
        var connection, n, starters, _ref;
        Logger.info("Starting connections...");
        starters = {};
        _ref = this.connections;
        for (n in _ref) {
          connection = _ref[n];
          starters[n] = connection.connect;
        }
        return Async.parallel(starters, callback);
      };

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
        if (this.robot.testing != null) {
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

      Robot.prototype.requireAdaptor = function(adaptorName) {
        if (this.robot.adaptors[adaptorName] == null) {
          this.robot.registerAdaptor("cylon-" + adaptorName, adaptorName);
          this.robot.adaptors[adaptorName].register(this);
        }
        return this.robot.adaptors[adaptorName];
      };

      Robot.prototype.registerAdaptor = function(moduleName, adaptorName) {
        if (this.adaptors[adaptorName] == null) {
          return this.adaptors[adaptorName] = require(moduleName);
        }
      };

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
        if (this.robot.testing != null) {
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

      Robot.prototype.requireDriver = function(driverName) {
        if (this.robot.drivers[driverName] == null) {
          this.robot.registerDriver("cylon-" + driverName, driverName);
          this.robot.drivers[driverName].register(this);
        }
        return this.robot.drivers[driverName];
      };

      Robot.prototype.registerDriver = function(moduleName, driverName) {
        if (this.drivers[driverName] == null) {
          return this.drivers[driverName] = require(moduleName);
        }
      };

      Robot.prototype.toString = function() {
        return "[Robot name='" + this.name + "']";
      };

      return Robot;

    })(EventEmitter);
  });

  module.exports = Cylon.Robot;

}).call(this);
