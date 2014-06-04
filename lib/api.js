/*
 * Cylon API
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var fs = require('fs'),
    path = require('path');

var express = require('express'),
    bodyParser = require('body-parser');

var Logger = require('./logger');

var API = module.exports = function API(opts) {
  var self = this;

  if (opts == null) {
    opts = {};
  }

  for (var d in this.defaults) {
    this[d] = opts.hasOwnProperty(d) ? opts[d] : this.defaults[d];
  }

  this.createServer();

  var authfn = this.setupAuth();
  this.server.use(authfn);

  this.server.set('title', 'Cylon API Server');

  this.server.use(express["static"](__dirname + "/../node_modules/robeaux/"));

  this.configureRoutes();
};

API.prototype.defaults = {
  host: '127.0.0.1',
  port: '3000',
  auth: false,
  CORS: '',
  ssl: {
    key: path.normalize(__dirname + "/api/ssl/server.key"),
    cert: path.normalize(__dirname + "/api/ssl/server.crt")
  }
};

API.prototype.createServer = function createServer() {
  this.server = express();

  //configure ssl if requested
  if (this.ssl && typeof(this.ssl) === 'object') {
    var https = require('https');

    this.server.node = https.createServer({
      key:  fs.readFileSync(this.ssl.key),
      cert: fs.readFileSync(this.ssl.cert)
    }, this.server);
  } else {
    Logger.warn("API using insecure connection. We recommend using an SSL certificate with Cylon.")
    this.server.node = this.server;
  }
};

API.prototype.setupAuth = function setupAuth() {
  var authfn = function auth(req, res, next) { next(); };

  if (typeof(this.auth) === 'object' && this.auth.type) {
    var type = this.auth.type,
        module = "./api/auth/" + type,
        filename = path.normalize(__dirname + "/" + module + ".js"),
        exists = fs.existsSync(filename);

    if (exists) {
      authfn = require(filename)(this.auth);
    }
  };

  return authfn;
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
  var Cylon = require('./cylon');

  var self = this;

  this.server.all("/*", function(req, res, next) {
    res.set("Access-Control-Allow-Origin", self.CORS || "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set('Content-Type', 'application/json');
    return next();
  });

  this.server.get("/robots", function(req, res) {
    var data = [];

    for (var i = 0; i < Cylon.robots.length; i++) {
      var robot = Cylon.robots[i];
      data.push(robot.data());
    }

    res.json(data);
  });

  this.server.get("/robots/:robot", function(req, res) {
    Cylon.findRobot(req.params.robot, function(err, robot) {
      res.json(err ? err : robot.data());
    });
  });

  this.server.get("/robots/:robot/commands", function(req, res) {
    Cylon.findRobot(req.params.robot, function(err, robot) {
      res.json(err ? err : robot.data().commands);
    });
  });

  this.server.all("/robots/:robot/commands/:command", function(req, res) {
    var params = self.parseCommandParams(req);

    Cylon.findRobot(req.params.robot, function(err, robot) {
      if (err) { return res.json(err); }

      var result = robot[req.params.command].apply(robot, params);
      res.json({ result: result });
    });
  });

  this.server.get("/robots/:robot/devices", function(req, res) {
    Cylon.findRobot(req.params.robot, function(err, robot) {
      res.json(err ? err : robot.data().devices);
    });
  });

  this.server.get("/robots/:robot/devices/:device", function(req, res) {
    var robot = req.params.robot,
        device = req.params.device;

    Cylon.findRobotDevice(robot, device, function(err, device) {
      res.json(err ? err : device.data());
    });
  });

  this.server.get("/robots/:robot/devices/:device/events/:event", function(req, res) {
    var robot = req.params.robot,
        device = req.params.device,
        event = req.params.event;

    Cylon.findRobotDevice(robot, device, function(err, device) {
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

    Cylon.findRobotDevice(robot, device, function(err, device) {
      res.json(err ? err : device.data().commands);
    });
  });

  this.server.all("/robots/:robot/devices/:device/commands/:command", function(req, res) {
    var robot = req.params.robot,
        device = req.params.device,
        command = req.params.command;

    var params = self.parseCommandParams(req);

    Cylon.findRobotDevice(robot, device, function(err, device) {
      if (err) { return res.json(err); }

      var result = device[command].apply(device, params);
      res.json({ result: result });
    });
  });

  this.server.get("/robots/:robot/connections", function(req, res) {
    Cylon.findRobot(req.params.robot, function(err, robot) {
      res.json(err ? err : robot.data().connections);
    });
  });

  this.server.get("/robots/:robot/connections/:connection", function(req, res) {
    var robot = req.params.robot,
        connection = req.params.connection;

    Cylon.findRobotConnection(robot, connection, function(err, connection) {
      res.json(err ? err : connection.data());
    });
  });
};
