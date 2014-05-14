/*
 * api
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var fs = require('fs');

var express = require('express');

var Logger = require('./logger');

var API = module.exports = function API(opts) {
  var self = this;

  if (opts == null) {
    opts = {};
  }

  this.opts   = opts;
  this.host   = opts.host || "127.0.0.1";
  this.port   = opts.port || "3000";
  this.ssl    = opts.ssl;
  this.master = opts.master;
  this.server = express();

  //configure ssl if requested
  if (this.ssl && typeof(this.ssl) === 'object') {
    var https = require('https');

    var options = {
      key:  fs.readFileSync(this.ssl.key || __dirname + "/ssl/server.key"),
      cert: fs.readFileSync(this.ssl.cert || __dirname + "/ssl/server.crt")
    };

    this.server.node = https.createServer(options, this.server);
  } else {
    Logger.warn("API using insecure connection. We recommend using an SSL certificate with Cylon.")
    this.server.node = this.server;
  }

  // configure basic auth, if requested
  if (opts.auth && opts.auth.type && opts.auth.type === 'basic') {
    var user = opts.auth.user,
        pass = opts.auth.pass;

    if (user && pass) {
      this.server.use(express.basicAuth(user, pass));
    }
  }

  this.server.set('title', 'Cylon API Server');
  this.server.use(express.json());
  this.server.use(express.urlencoded());
  this.server.use(express["static"](__dirname + "/../node_modules/robeaux/"));
};

API.prototype.listen = function() {
  var self = this;

  this.server.node.listen(this.port, this.host, null, function() {
    var title    = self.server.get('title');
    var protocol = self.ssl ? "https" : "http";

    Logger.info(title + " is now online.");
    Logger.info("Listening at " + protocol + "://" + self.host + ":" + self.port);
  });
};

// Parses req to extract params to be used for commands.
//
// Returns an array of params
API.prototype.parseCommandParams = function(req) {
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

// Sets all routes for the server
API.prototype.configureRoutes = function() {
  var self = this;

  var master = this.master;

  this.server.all("/*", function(req, res, next) {
    res.set("Access-Control-Allow-Origin", self.opts.CORS || "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set('Content-Type', 'application/json');
    return next();
  });

  this.server.get("/robots", function(req, res) {
    var data = [];

    for (var i = 0; i < master.robots.length; i++) {
      var robot = master.robots[i];
      data.push(robot.data());
    }

    res.json(data);
  });

  this.server.get("/robots/:robot", function(req, res) {
    master.findRobot(req.params.robot, function(err, robot) {
      res.json(err ? err : robot.data());
    });
  });

  this.server.get("/robots/:robot/commands", function(req, res) {
    master.findRobot(req.params.robot, function(err, robot) {
      res.json(err ? err : robot.data().commands);
    });
  });

  this.server.all("/robots/:robot/commands/:command", function(req, res) {
    var params = self.parseCommandParams(req);

    master.findRobot(req.params.robot, function(err, robot) {
      if (err) { return res.json(err); }

      var result = robot[req.params.command].apply(robot, params);
      res.json({ result: result });
    });
  });

  this.server.get("/robots/:robot/devices", function(req, res) {
    master.findRobot(req.params.robot, function(err, robot) {
      res.json(err ? err : robot.data().devices);
    });
  });

  this.server.get("/robots/:robot/devices/:device", function(req, res) {
    var robot = req.params.robot,
        device = req.params.device;

    master.findRobotDevice(robot, device, function(err, device) {
      res.json(err ? err : device.data());
    });
  });

  this.server.get("/robots/:robot/devices/:device/events/:event", function(req, res) {
    var robot = req.params.robot,
        device = req.params.device,
        event = req.params.event;

    master.findRobotDevice(robot, device, function(err, device) {
      if (err) { res.json(err); }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      });

      var writeData = function(data) {
        res.write("data: " + JSON.stringify(data) + "\n\n")
      };

      device.on(event, writeData);

      res.on('close', function() {
        device.removeListener(event, writeData);
      });
    });
  });

  this.server.get("/robots/:robot/devices/:device/commands", function(req, res) {
    var robot = req.params.robot,
        device = req.params.device;

    master.findRobotDevice(robot, device, function(err, device) {
      res.json(err ? err : device.data().commands);
    });
  });

  this.server.all("/robots/:robot/devices/:device/commands/:command", function(req, res) {
    var robot = req.params.robot,
        device = req.params.device,
        command = req.params.command;

    var params = self.parseCommandParams(req);

    master.findRobotDevice(robot, device, function(err, device) {
      if (err) { return res.json(err); }

      var result = device[command].apply(device, params);
      res.json({ result: result });
    });
  });

  this.server.get("/robots/:robot/connections", function(req, res) {
    master.findRobot(req.params.robot, function(err, robot) {
      res.json(err ? err : robot.data().connections);
    });
  });

  this.server.get("/robots/:robot/connections/:connection", function(req, res) {
    var robot = req.params.robot,
        connection = req.params.connection;

    master.findRobotConnection(robot, connection, function(err, connection) {
      res.json(err ? err : connection.data());
    });
  });
};
