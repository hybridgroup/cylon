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
        this.configureRoutes();
        this.server.listen(this.port, this.host, function() {
          return Logger.info("" + _this.server.name + " is listening at " + _this.host + ":" + _this.port);
        });
      }

      Server.prototype.configureRoutes = function() {
        this.server.get("/robots", function(req, res) {
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
        });
        this.server.get("/robots/:robotid", function(req, res) {
          return master.findRobot(req.params.robotid, function(err, robot) {
            return res.json(err ? err : robot.data());
          });
        });
        this.server.get("/robots/:robotid/devices", function(req, res) {
          return master.findRobot(req.params.robotid, function(err, robot) {
            return res.json(err ? err : robot.data().devices);
          });
        });
        this.server.get("/robots/:robotid/devices/:deviceid", function(req, res) {
          var deviceid, robotid, _ref;
          _ref = [req.params.robotid, req.params.deviceid], robotid = _ref[0], deviceid = _ref[1];
          return master.findRobotDevice(robotid, deviceid, function(err, device) {
            return res.json(err ? err : device.data());
          });
        });
        this.server.get("/robots/:robotid/devices/:deviceid/commands", function(req, res) {
          var deviceid, robotid, _ref;
          _ref = [req.params.robotid, req.params.deviceid], robotid = _ref[0], deviceid = _ref[1];
          return master.findRobotDevice(robotid, deviceid, function(err, device) {
            return res.json(err ? err : device.data().commands);
          });
        });
        this.server.post("/robots/:robot/devices/:device/commands/:command", function(req, res) {
          var commandid, deviceid, key, params, robotid, value, _ref;
          params = [req.params.robot, req.params.device, req.params.command];
          robotid = params[0], deviceid = params[1], commandid = params[2];
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
        });
        this.server.get("/robots/:robotid/connections", function(req, res) {
          return master.findRobot(req.params.robotid, function(err, robot) {
            return res.json(err ? err : robot.data().connections);
          });
        });
        this.server.get("/robots/:robot/connections/:connection", function(req, res) {
          var connectionid, robotid, _ref;
          _ref = [req.params.robot, req.params.connection], robotid = _ref[0], connectionid = _ref[1];
          return master.findRobotConnection(robotid, connectionid, function(err, connection) {
            return res.json(err ? err : connection.data());
          });
        });
        this.server.get("/robots/:robotid/devices/:deviceid/events", function(req, res) {
          return req.io.route('events');
        });
        return this.server.io.route('events', function(req) {
          var deviceid, robotid, _ref;
          _ref = [req.params.robotid, req.params.deviceid], robotid = _ref[0], deviceid = _ref[1];
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
        });
      };

      return Server;

    })();
  });

}).call(this);
