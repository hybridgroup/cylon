/* jshint maxlen: false */

/*
 * Cylon API - Route Definitions
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("../cylon");

var router = module.exports = require("express").Router();

var eventHeaders = {
  "Content-Type": "text/event-stream",
  "Connection": "keep-alive",
  "Cache-Control": "no-cache"
};

// Loads up the appropriate Robot/Device/Connection instances, if they are
// present in the route params.
var load = function load(req, res, next) {
  var robot = req.params.robot,
      device = req.params.device,
      connection = req.params.connection;

  if (robot) {
    req.robot = Cylon.robots[robot];
    if (!req.robot) {
      return res.status(404).json({
        error: "No Robot found with the name " + robot
      });
    }
  }

  if (device) {
    req.device = req.robot.devices[device];
    if (!req.device) {
      return res.status(404).json({
        error: "No device found with the name " + device
      });
    }
  }

  if (connection) {
    req.connection = req.robot.connections[connection];
    if (!req.connection) {
      return res.status(404).json({
        error: "No connection found with the name " + connection
      });
    }
  }

  next();
};

router.get("/", function(req, res) {
  res.json({ MCP: Cylon.toJSON() });
});

router.get("/events", function(req, res) {
  res.json({ events: Cylon.events });
});

router.get("/events/:event", function(req, res) {
  var event = req.params.event;

  res.writeHead(200, eventHeaders);

  var writeData = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };

  Cylon.on(event, writeData);

  res.on("close", function() {
    Cylon.removeListener(event, writeData);
  });
});

router.get("/commands", function(req, res) {
  res.json({ commands: Object.keys(Cylon.commands) });
});

router.post("/commands/:command", function(req, res) {
  var command = Cylon.commands[req.params.command];
  router.runCommand(req, res, Cylon, command);
});

router.get("/robots", function(req, res) {
  res.json({ robots: Cylon.toJSON().robots });
});

router.get("/robots/:robot", load, function(req, res) {
  res.json({ robot: req.robot });
});

router.get("/robots/:robot/commands", load, function(req, res) {
  res.json({ commands: Object.keys(req.robot.commands) });
});

router.all("/robots/:robot/commands/:command", load, function(req, res) {
  var command = req.robot.commands[req.params.command];
  router.runCommand(req, res, req.robot, command);
});

router.get("/robots/:robot/events", load, function(req, res) {
  res.json({ events: req.robot.events });
});

router.all("/robots/:robot/events/:event", load, function(req, res) {
  var event = req.params.event;

  res.writeHead(200, eventHeaders);

  var writeData = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };

  req.robot.on(event, writeData);

  res.on("close", function() {
    req.robot.removeListener(event, writeData);
  });
});

router.get("/robots/:robot/devices", load, function(req, res) {
  res.json({ devices: req.robot.toJSON().devices });
});

router.get("/robots/:robot/devices/:device", load, function(req, res) {
  res.json({ device: req.device });
});

router.get("/robots/:robot/devices/:device/events", load, function(req, res) {
  res.json({ events: req.device.events });
});

router.get("/robots/:robot/devices/:device/events/:event", load, function(req, res) {
  var event = req.params.event;

  res.writeHead(200, eventHeaders);

  var writeData = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };

  req.device.on(event, writeData);

  res.on("close", function() {
    req.device.removeListener(event, writeData);
  });
});

router.get("/robots/:robot/devices/:device/commands", load, function(req, res) {
  res.json({ commands: Object.keys(req.device.commands) });
});

router.all("/robots/:robot/devices/:device/commands/:command", load, function(req, res) {
  var command = req.device.commands[req.params.command];
  router.runCommand(req, res, req.device, command);
});

router.get("/robots/:robot/connections", load, function(req, res) {
  res.json({ connections: req.robot.toJSON().connections });
});

router.get("/robots/:robot/connections/:connection", load, function(req, res) {
  res.json({ connection: req.connection });
});

// Run an MCP, Robot, or Device command.  Process the results immediately,
// or asynchronously if the result is a Promise.
router.runCommand = function(req, res, my, command) {
  var result = command.apply(my, req.commandParams);
  if (typeof result.then === "function") {
    result
      .then(function(result) {return res.json({result: result});})
      .catch(function(err) {return res.status(500).json({error: err});});
  }
  else {
    res.json({ result: result });
  }
};
