/*
 * api
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  var express, namespace;

  express = require('express.io');

  namespace = require('node-namespace');

  namespace("Api", function() {
    return this.Server = (function() {
      var master;

      master = null;

      function Server(opts) {
        var _this = this;
        if (opts == null) {
          opts = {};
        }
        this.host = opts.host || "127.0.0.1";
        this.port = opts.port || "3000";
        master = opts.master;
        this.server = express().http().io();
        this.server.set('name', 'Cylon API Server');
        this.server.use(express.bodyParser());
        this.server.get("/*", function(req, res, next) {
          res.set('Content-Type', 'application/json');
          return next();
        });
        this.routes(this.server);
        this.server.listen(this.port, this.host, function() {
          return Logger.info("" + _this.server.name + " is listening at " + _this.host + ":" + _this.port);
        });
      }

      Server.prototype.routes = function(server) {
        server.get("/robots", this.getRobots);
        server.get("/robots/:robotid", this.getRobotByName);
        server.get("/robots/:robotid/devices", this.getDevices);
        server.get("/robots/:robotid/devices/:deviceid", this.getDeviceByName);
        server.get("/robots/:robotid/devices/:deviceid/commands", this.getDeviceCommands);
        server.post("/robots/:robotid/devices/:deviceid/commands/:commandid", this.runDeviceCommand);
        server.get("/robots/:robotid/connections", this.getConnections);
        server.get("/robots/:robotid/connections/:connectionid", this.getConnectionByName);
        server.get("/robots/:robotid/devices/:deviceid/events", function(req, res) {
          return req.io.route('events');
        });
        return server.io.route('events', this.ioSetupDeviceEventClient);
      };

      Server.prototype.getRobots = function(req, res) {
        var robot;
        return res.json((function() {
          var _i, _len, _ref, _results;
          _ref = master.robots();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            robot = _ref[_i];
            _results.push(robot.data());
          }
          return _results;
        })());
      };

      Server.prototype.getRobotByName = function(req, res) {
        return master.findRobot(req.params.robotid, function(err, robot) {
          return res.json(err ? err : robot.data());
        });
      };

      Server.prototype.getDevices = function(req, res) {
        return master.findRobot(req.params.robotid, function(err, robot) {
          return res.json(err ? err : robot.data().devices);
        });
      };

      Server.prototype.getDeviceByName = function(req, res) {
        var deviceid, robotid;
        robotid = req.params.robotid;
        deviceid = req.params.deviceid;
        return master.findRobotDevice(robotid, deviceid, function(err, device) {
          return res.json(err ? err : device.data());
        });
      };

      Server.prototype.getDeviceCommands = function(req, res) {
        var deviceid, robotid;
        robotid = req.params.robotid;
        deviceid = req.params.deviceid;
        return master.findRobotDevice(robotid, deviceid, function(err, device) {
          return res.json(err ? err : device.data().commands);
        });
      };

      Server.prototype.runDeviceCommand = function(req, res) {
        var commandid, deviceid, key, params, robotid, value, _ref;
        robotid = req.params.robotid;
        deviceid = req.params.deviceid;
        commandid = req.params.commandid;
        params = [];
        if (typeof req.body === 'object') {
          _ref = req.body;
          for (key in _ref) {
            value = _ref[key];
            params.push(value);
          }
        }
        return master.findRobotDevice(robotid, deviceid, function(err, device) {
          var result;
          if (err) {
            return res.json(err);
          }
          result = device[commandid].apply(device, params);
          return res.json({
            result: result
          });
        });
      };

      Server.prototype.getConnections = function(req, res) {
        return master.findRobot(req.params.robotid, function(err, robot) {
          return res.json(err ? err : robot.data().connections);
        });
      };

      Server.prototype.getConnectionByName = function(req, res) {
        var connectionid, robotid;
        robotid = req.params.robotid;
        connectionid = req.params.connectionid;
        return master.findRobotConnection(robotid, connectionid, function(err, connection) {
          return res.json(err ? err : connection.data());
        });
      };

      Server.prototype.ioSetupDeviceEventClient = function(req) {
        var deviceid, robotid;
        robotid = req.params.robotid;
        deviceid = req.params.deviceid;
        return master.findRobotDevice(robotid, deviceid, function(err, device) {
          if (err) {
            res.io.respond(err);
          }
          return device.on('update', function(data) {
            return res.io.respond({
              data: data
            });
          });
        });
      };

      return Server;

    })();
  });

}).call(this);
