(function() {
  'use strict';
  var express, namespace;

  express = require('express.io');

  namespace = require('node-namespace');

  namespace('Api', function() {
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
        this.server.get("/robots/:robotname", function(req, res) {
          return master.findRobot(req.params.robotname, function(err, robot) {
            return res.json(err ? err : robot.data());
          });
        });
        this.server.get("/robots/:robotname/devices", function(req, res) {
          return master.findRobot(req.params.robotname, function(err, robot) {
            return res.json(err ? err : robot.data().devices);
          });
        });
        this.server.get("/robots/:robotname/devices/:devicename", function(req, res) {
          var devicename, params, robotname;
          params = [req.params.robotname, req.params.devicename];
          robotname = params[0], devicename = params[1];
          return master.findRobotDevice(robotname, devicename, function(err, device) {
            return res.json(err ? err : device.data());
          });
        });
        this.server.get("/robots/:robotname/devices/:devicename/commands", function(req, res) {
          var devicename, params, robotname;
          params = [req.params.robotname, req.params.devicename];
          robotname = params[0], devicename = params[1];
          return master.findRobotDevice(robotname, devicename, function(err, device) {
            return res.json(err ? err : device.data().commands);
          });
        });
        this.server.all("/robots/:robot/devices/:device/commands/:commandname", function(req, res) {
          var commandname, devicename, key, params, robotname, value, _ref;
          params = [req.params.robot, req.params.device, req.params.commandname];
          robotname = params[0], devicename = params[1], commandname = params[2];
          params = [];
          if (typeof req.body === 'object') {
            _ref = req.body;
            for (key in _ref) {
              value = _ref[key];
              params.push(value);
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
          var connectionname, params, robotname;
          params = [req.params.robot, req.params.connection];
          robotname = params[0], connectionname = params[1];
          return master.findRobotConnection(robotname, connectionname, function(err, connection) {
            return res.json(err ? err : connection.data());
          });
        });
        this.server.get("/robots/:robotname/devices/:devicename/events", function(req, res) {
          return req.io.route('events');
        });
        return this.server.io.route('events', function(req) {
          var devicename, params, robotname;
          params = [req.params.robotname, req.params.devicename];
          robotname = params[0], devicename = params[1];
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

      return Server;

    })();
  });

}).call(this);
