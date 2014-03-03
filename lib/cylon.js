/*
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";


require('./config');
require('./utils');
require('./logger');
require('./driver');
require('./adaptor');

Logger.setup();

// Cylon is the global namespace for the project, and also in charge of
// maintaining the Master singleton that controls all the robots.
var Cylon = (function() {
  function Cylon() {}

  var instance = null;

  // Public: Fetches singleton instance of Master, or creates a new one if it
  // doesn't already exist
  //
  // Returns a Master instance
  Cylon.getInstance = function() {
    return new Master();
  };

  // The Master class is our puppeteer that manages all the robots, as well as
  // starting them and the API.
  var Master = (function() {
    var robots = [],
        api = null,
        api_config = { host: '127.0.0.1', port: '3000' };

    // Public: Creates a new Master
    //
    // Returns a Master instance
    function Master() {
      this.robot = bind(this.robot, this);

      this.self = this;

      if (process.platform === "win32") {
        var readline = require("readline"),
            io = { input: process.stdin, output: process.stdout }

        readline.createInterface(io).on("SIGINT", function() {
          process.emit("SIGINT");
        });
      }

      process.on("SIGINT", function() {
        Cylon.getInstance().stop();
        process.kill();
      });
    }

    // Public: Creates a new Robot
    //
    // opts - hash of Robot attributes
    //
    // Returns a shiny new Robot
    // Examples:
    //   Cylon.robot
    //     connection: { name: 'arduino', adaptor: 'firmata' }
    //     device: { name: 'led', driver: 'led', pin: 13 }
    //
    //     work: (me) ->
    //       me.led.toggle()
    Master.prototype.robot = function(opts) {
      var Robot = require("./robot");
      opts.master = this;

      var robot = new Robot(opts);

      robots.push(robot);
      return robot;
    };

    // Public: Returns all Robots the Master knows about
    //
    // Returns an array of all Robot instances
    Master.prototype.robots = function() {
      return robots;
    };

    // Public: Configures the API host and port based on passed options
    //
    // opts - object containing API options
    //   host - host address API should serve from
    //   port - port API should listen for requests on
    //
    // Returns the API configuration
    Master.prototype.api = function(opts) {
      if (opts == null) { opts = {}; }

      api_config.host = opts.host || "127.0.0.1";
      api_config.port = opts.port || "3000";

      return api_config;
    };

    // Public: Finds a particular robot by name
    //
    // name - name of the robot to find
    // callback - optional callback to be executed
    //
    // Returns the found Robot or result of the callback if it's supplied
    Master.prototype.findRobot = function(name, callback) {
      var error,
          robot = null;

      for (var i = 0; i < robots.length; i++) {
        var bot = robots[i];
        if (bot.name === name) { robot = bot; }
      }

      if (robot == null) {
        error = { error: "No Robot found with the name " + name };
      }

      return callback ? callback(error, robot) : robot;
    };

    // Public: Finds a particular Robot's device by name
    //
    // robotid - name of the robot to find
    // deviceid - name of the device to find
    // callback - optional callback to be executed
    //
    // Returns the found Device or result of the callback if it's supplied
    Master.prototype.findRobotDevice = function(robotid, deviceid, callback) {
      return this.findRobot(robotid, function(err, robot) {
        var error,
            device = null;

        if (err) { return callback(err, robot); }

        if (robot.devices[deviceid]) { device = robot.devices[deviceid]; }

        if (device == null) {
          error = { error: "No device found with the name " + deviceid + "." };
        }

        return callback ? callback(error, device) : device;
      });
    };

    // Public: Finds a particular Robot's connection by name
    //
    // robotid - name of the robot to find
    // connid - name of the device to find
    // callback - optional callback to be executed
    //
    // Returns the found Connection or result of the callback if it's supplied
    Master.prototype.findRobotConnection = function(robotid, connid, callback) {
      return this.findRobot(robotid, function(err, robot) {
        var error,
            connection = null;

        if (err) { return callback(err, robot); }

        if (robot.connections[connid]) { connection = robot.connections[connid]; }

        if (connection == null) {
          error = { error: "No connection found with the name " + connid + "." };
        }

        return callback ? callback(error, connection) : connection;
      });
    };

    // Public: Starts up the API and the robots
    //
    // Returns nothing
    Master.prototype.start = function() {
      this.startAPI();

      for (var i = 0; i < robots.length; i++) {
        var robot = robots[i];
        robot.start();
      }
    };

    // Public: Stops the API and the robots
    //
    // Returns nothing
    Master.prototype.stop = function() {
      for (var i = 0; i < robots.length; i++) {
        var robot = robots[i];
        robot.stop();
      }
    };

    // Creates a new instance of the Cylon API server, or returns the
    // already-existing one.
    //
    // Returns an Cylon.ApiServer instance
    Master.prototype.startAPI = function() {
      var Server = require('./api');
      api_config.master = this.self;
      return api != null ? api : api = new Server(api_config);
    };

    return Master;

  })();

  return Cylon;

}).call(this);

module.exports = Cylon.getInstance();
