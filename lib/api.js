/*
 * api
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var fs = require('fs');

var express = require('express.io'),
    namespace = require('node-namespace');

namespace("Cylon", function() {
  // The Cylon API Server provides an interface to communicate with master class
  // and retrieve information about the robots being controlled.
  this.ApiServer = (function() {
    var master;

    master = null;

    function ApiServer(opts) {
      var self = this;

      if (opts == null) { opts = {}; }

      this.host = opts.host || "127.0.0.1";
      this.port = opts.port || "3000";

      master = opts.master;

      var options = {
        cert: fs.readFileSync(opts.cert || __dirname + "/ssl/server.crt"),
        key: fs.readFileSync(opts.key || __dirname + "/ssl/server.key")
      }

      this.server = express().https(options).io();

      this.server.set('title', 'Cylon API Server');

      this.server.use(express.json());
      this.server.use(express.urlencoded());
      this.server.use(express["static"](__dirname + "/../node_modules/robeaux/"));

      this.server.get("/*", function(req, res, next) {
        res.set('Content-Type', 'application/json');
        return next();
      });

      this.configureRoutes();

      this.server.listen(this.port, this.host, function() {
        var title = self.server.get('title');
        Logger.info(title + " is listening on " + self.host + ":" + self.port);
      });
    }

    // Parses req to extract params to be used for commands.
    //
    // Returns an array of params
    ApiServer.prototype.parseCommandParams = function(req) {
      var param_container = {},
          params = [];

      if (req.method === 'GET' || Object.keys(req.query).length > 0) {
        param_container = req.query;
      } else if (typeof req.body === 'object') {
        param_container = req.body;
      }

      for (var p in param_container) { params.push(param_container[p]); }

      return params;
    };

    ApiServer.prototype.configureRoutes = function() {
      var self = this;

      this.server.get("/robots", function(req, res) {
        var data = [];

        for (var i = 0; i < master.robots.length; i++) {
          var robot = master.robots[i];
          data.push(robot.data());
        }

        res.json(data);
      });

      this.server.get("/robots/:robotname", function(req, res) {
        master.findRobot(req.params.robotname, function(err, robot) {
          res.json(err ? err : robot.data());
        });
      });

      this.server.get("/robots/:robotname/commands", function(req, res) {
        master.findRobot(req.params.robotname, function(err, robot) {
          res.json(err ? err : robot.data().commands);
        });
      });

      this.server.all("/robots/:robotname/commands/:commandname", function(req, res) {
        var params = self.parseCommandParams(req);

        master.findRobot(req.params.robotname, function(err, robot) {
          if (err) { return res.json(err); }

          var result = robot[req.params.commandname].apply(robot, params);
          res.json({ result: result });
        });
      });

      this.server.get("/robots/:robotname/devices", function(req, res) {
        master.findRobot(req.params.robotname, function(err, robot) {
          res.json(err ? err : robot.data().devices);
        });
      });

      this.server.get("/robots/:robotname/devices/:devicename", function(req, res) {
        var robotname = req.params.robotname,
            devicename = req.params.devicename;

        master.findRobotDevice(robotname, devicename, function(err, device) {
          res.json(err ? err : device.data());
        });
      });

      this.server.get("/robots/:robotname/devices/:devicename/commands", function(req, res) {
        var robotname = req.params.robotname,
            devicename = req.params.devicename;

        master.findRobotDevice(robotname, devicename, function(err, device) {
          res.json(err ? err : device.data().commands);
        });
      });

      this.server.all("/robots/:robot/devices/:device/commands/:commandname", function(req, res) {
        var robotname = req.params.robot,
            devicename = req.params.device,
            commandname = req.params.commandname;

        var params = self.parseCommandParams(req);

        master.findRobotDevice(robotname, devicename, function(err, device) {
          if (err) { return res.json(err); }

          var result = device[commandname].apply(device, params);
          res.json({ result: result });
        });
      });

      this.server.get("/robots/:robotname/connections", function(req, res) {
        master.findRobot(req.params.robotname, function(err, robot) {
          res.json(err ? err : robot.data().connections);
        });
      });

      this.server.get("/robots/:robot/connections/:connection", function(req, res) {
        var robotname = req.params.robot,
            connectionname = req.params.connection;

        master.findRobotConnection(robotname, connectionname, function(err, connection) {
          res.json(err ? err : connection.data());
        });
      });

      this.server.get("/robots/:robotname/devices/:devicename/events", function(req, res) {
        req.io.route('events');
      });

      this.server.io.route('events', function(req) {
        var robotname = req.params.robotname,
            devicename = req.params.devicename

        master.findRobotDevice(robotname, devicename, function(err, device) {
          if (err) { return req.io.respond(err); }

          device.on('update', function(data) {
            req.io.emit('update', { data: data });
          });
        });
      });
    };

    return ApiServer;

  })();
});

module.exports = Cylon.ApiServer;
