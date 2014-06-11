/*
 * Cylon API - Route Definitions
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

var Cylon = require('../cylon');

var router = module.exports = require('express').Router();

// Loads up the appropriate Robot/Device/Connection instances, if they are
// present in the route params.
var load = function load(req, res, next) {
  var robot = req.params.robot,
      device = req.params.device,
      connection = req.params.connection;

  if (robot) {
    req.robot = Cylon.robots[robot];
    if (!req.robot) {
      return res.json({ error: "No Robot found with the name " + robot });
    }
  }

  if (device) {
    req.device = req.robot.devices[device];
    if (!req.device) {
      return res.json({ error: "No device found with the name " + device });
    }
  }

  if (connection) {
    req.connection = req.robot.connections[connection];
    if (!req.connection) {
      return res.json({ error: "No connection found with the name " + connection });
    }
  }

  next();
};

router.get("/robots", function(req, res) {
  var data = [];

  for (var bot in Cylon.robots) {
    data.push(Cylon.robots[bot]);
  }

  res.json(data);
});

router.get("/robots/:robot", load, function(req, res) {
  res.json(req.robot);
});

router.get("/robots/:robot/commands", load, function(req, res) {
  res.json(req.robot.toJSON().commands);
});

router.all("/robots/:robot/commands/:command", load, function(req, res) {
  var command = req.params.command;

  var result = req.robot[command].apply(req.robot, req.commandParams);
  res.json({ result: result });
});

router.get("/robots/:robot/devices", load, function(req, res) {
  res.json(req.robot.toJSON().devices);
});

router.get("/robots/:robot/devices/:device", load, function(req, res) {
  res.json(req.device);
});

router.get("/robots/:robot/devices/:device/events/:event", load, function(req, res) {
  var event = req.params.event;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  var writeData = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };

  req.device.on(event, writeData);

  res.on('close', function() {
    req.device.removeListener(event, writeData);
  });
});

router.get("/robots/:robot/devices/:device/commands", load, function(req, res) {
  res.json(req.device.toJSON().commands);
});

router.all("/robots/:robot/devices/:device/commands/:command", load, function(req, res) {
  var command = req.params.command;

  var result = req.device[command].apply(req.device, req.commandParams);
  res.json({ result: result });
});

router.get("/robots/:robot/connections", load, function(req, res) {
  res.json(req.robot.toJSON().connections);
});

router.get("/robots/:robot/connections/:connection", load, function(req, res) {
  res.json(req.connection);
});
