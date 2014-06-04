/*
 * Cylon API - Route Definitions
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

var Cylon = require('../cylon');

var router = module.exports = require('express').Router();

// Parses req to extract params to be used for commands.
//
// Returns an array of params
var parseCommandParams = function(req) {
  var param_container = {},
      params = [];

  if (req.method === 'GET' || Object.keys(req.query).length > 0) {
    param_container = req.query;
  } else if (typeof req.body === 'object') {
    param_container = req.body;
  }

  for (var p in param_container) {
    params.push(param_container[p]);
  }

  return params;
};

router.get("/robots", function(req, res) {
  var data = [];

  for (var i = 0; i < Cylon.robots.length; i++) {
    var robot = Cylon.robots[i];
    data.push(robot.data());
  }

  res.json(data);
});

router.get("/robots/:robot", function(req, res) {
  Cylon.findRobot(req.params.robot, function(err, robot) {
    res.json(err ? err : robot.data());
  });
});

router.get("/robots/:robot/commands", function(req, res) {
  Cylon.findRobot(req.params.robot, function(err, robot) {
    res.json(err ? err : robot.data().commands);
  });
});

router.all("/robots/:robot/commands/:command", function(req, res) {
  var params = parseCommandParams(req);

  Cylon.findRobot(req.params.robot, function(err, robot) {
    if (err) { return res.json(err); }

    var result = robot[req.params.command].apply(robot, params);
    res.json({ result: result });
  });
});

router.get("/robots/:robot/devices", function(req, res) {
  Cylon.findRobot(req.params.robot, function(err, robot) {
    res.json(err ? err : robot.data().devices);
  });
});

router.get("/robots/:robot/devices/:device", function(req, res) {
  var robot = req.params.robot,
      device = req.params.device;

  Cylon.findRobotDevice(robot, device, function(err, device) {
    res.json(err ? err : device.data());
  });
});

router.get("/robots/:robot/devices/:device/events/:event", function(req, res) {
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

router.get("/robots/:robot/devices/:device/commands", function(req, res) {
  var robot = req.params.robot,
      device = req.params.device;

  Cylon.findRobotDevice(robot, device, function(err, device) {
    res.json(err ? err : device.data().commands);
  });
});

router.all("/robots/:robot/devices/:device/commands/:command", function(req, res) {
  var robot = req.params.robot,
      device = req.params.device,
      command = req.params.command;

  var params = parseCommandParams(req);

  Cylon.findRobotDevice(robot, device, function(err, device) {
    if (err) { return res.json(err); }

    var result = device[command].apply(device, params);
    res.json({ result: result });
  });
});

router.get("/robots/:robot/connections", function(req, res) {
  Cylon.findRobot(req.params.robot, function(err, robot) {
    res.json(err ? err : robot.data().connections);
  });
});

router.get("/robots/:robot/connections/:connection", function(req, res) {
  var robot = req.params.robot,
      connection = req.params.connection;

  Cylon.findRobotConnection(robot, connection, function(err, connection) {
    res.json(err ? err : connection.data());
  });
});
