/*
 * api
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var express, namespace;

  express = require('express.io');

  namespace = require('node-namespace');

  namespace('Cylon', function() {
    return this.ApiServer = (function() {
      var master;

      master = null;

      function ApiServer(opts) {
        var _this = this;
        if (opts == null) {
          opts = {};
        }
        this.host = opts.host || "127.0.0.1";
        this.port = opts.port || "3000";
        master = opts.master;
        this.server = express().http().io();
        this.server.set('title', 'Cylon API Server');
        this.server.use(express.json());
        this.server.use(express.urlencoded());
        this.server.use(express["static"](__dirname + "/../api"));
        this.server.get("/*", function(req, res, next) {
          res.set('Content-Type', 'application/json');
          return next();
        });
        this.configureRoutes();
        this.server.listen(this.port, this.host, function() {
          return Logger.info("" + (_this.server.get('title')) + " is listening on " + _this.host + ":" + _this.port);
        });
      }

      ApiServer.prototype.configureRoutes = function() {
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
        this.server.get("/robots/:robotname", function(req, res) {
          return master.findRobot(req.params.robotname, function(err, robot) {
            return res.json(err ? err : robot.data());
          });
        });
        this.server.get("/robots/:robotname/commands", function(req, res) {
          return master.findRobot(req.params.robotname, function(err, robot) {
            return res.json(err ? err : robot.data().commands);
          });
        });
        this.server.all("/robots/:robotname/commands/:commandname", function(req, res) {
          var params, v, _, _ref;
          params = [];
          if (typeof req.body === 'object') {
            _ref = req.body;
            for (_ in _ref) {
              v = _ref[_];
              params.push(v);
            }
          }
          return master.findRobot(req.params.robotname, function(err, robot) {
            var result;
            if (err) {
              return res.json(err);
            }
            result = robot[req.params.commandname].apply(robot, params);
            return res.json({
              result: result
            });
          });
        });
        this.server.get("/robots/:robotname/devices", function(req, res) {
          return master.findRobot(req.params.robotname, function(err, robot) {
            return res.json(err ? err : robot.data().devices);
          });
        });
        this.server.get("/robots/:robotname/devices/:devicename", function(req, res) {
          var devicename, robotname, _ref;
          _ref = [req.params.robotname, req.params.devicename], robotname = _ref[0], devicename = _ref[1];
          return master.findRobotDevice(robotname, devicename, function(err, device) {
            return res.json(err ? err : device.data());
          });
        });
        this.server.get("/robots/:robotname/devices/:devicename/commands", function(req, res) {
          var devicename, robotname, _ref;
          _ref = [req.params.robotname, req.params.devicename], robotname = _ref[0], devicename = _ref[1];
          return master.findRobotDevice(robotname, devicename, function(err, device) {
            return res.json(err ? err : device.data().commands);
          });
        });
        this.server.all("/robots/:robot/devices/:device/commands/:commandname", function(req, res) {
          var commandname, devicename, params, robotname, v, _, _ref;
          params = [req.params.robot, req.params.device, req.params.commandname];
          robotname = params[0], devicename = params[1], commandname = params[2];
          params = [];
          if (typeof req.body === 'object') {
            _ref = req.body;
            for (_ in _ref) {
              v = _ref[_];
              params.push(v);
            }
          }
          return master.findRobotDevice(robotname, devicename, function(err, device) {
            var result;
            if (err) {
              return res.json(err);
            }
            result = device[commandname].apply(device, params);
            return res.json({
              result: result
            });
          });
        });
        this.server.get("/robots/:robotname/connections", function(req, res) {
          return master.findRobot(req.params.robotname, function(err, robot) {
            return res.json(err ? err : robot.data().connections);
          });
        });
        this.server.get("/robots/:robot/connections/:connection", function(req, res) {
          var connectionname, robotname, _ref;
          _ref = [req.params.robot, req.params.connection], robotname = _ref[0], connectionname = _ref[1];
          return master.findRobotConnection(robotname, connectionname, function(err, connection) {
            return res.json(err ? err : connection.data());
          });
        });
        this.server.get("/robots/:robotname/devices/:devicename/events", function(req, res) {
          return req.io.route('events');
        });
        return this.server.io.route('events', function(req) {
          var devicename, robotname, _ref;
          _ref = [req.params.robotname, req.params.devicename], robotname = _ref[0], devicename = _ref[1];
          return master.findRobotDevice(robotname, devicename, function(err, device) {
            if (err) {
              req.io.respond(err);
            }
            return device.on('update', function(data) {
              return req.io.emit('update', {
                data: data
              });
            });
          });
        });
      };

      return ApiServer;

    })();
  });

  module.exports = Cylon.ApiServer;

}).call(this);
