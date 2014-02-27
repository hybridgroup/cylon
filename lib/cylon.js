/*
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';

  var Cylon,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require('./config');

  require('./utils');

  require('./logger');

  require('./driver');

  require('./adaptor');

  Logger.setup();

  // Cylon is the global namespace for the project, and also in charge of
  // maintaining the Master singleton that controls all the robots.
  Cylon = (function() {
    var Master, instance;

    function Cylon() {}

    instance = null;

    // Public: Fetches singleton instance of Master, or creates a new one if it
    // doesn't already exist
    //
    // Returns a Master instance
    Cylon.getInstance = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return instance != null ? instance : instance = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Master, args, function(){});
    };

    // The Master class is our puppeteer that manages all the robots, as well as
    // starting them and the API.
    Master = (function() {
      var api, api_config, robots;

      robots = [];

      api = null;

      api_config = {
        host: '127.0.0.1',
        port: '3000'
      };

      // Public: Creates a new Master
      //
      // Returns a Master instance
      function Master() {
        this.robot = __bind(this.robot, this);
        var readLine, rl;
        this.self = this;
        if (process.platform === "win32") {
          readLine = require("readline");
          rl = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          rl.on("SIGINT", function() {
            return process.emit("SIGINT");
          });
        }
        process.on("SIGINT", function() {
          Cylon.getInstance().stop();
          return process.kill();
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
        var Robot, robot;
        Robot = require("./robot");
        opts.master = this;
        robot = new Robot(opts);
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
        if (opts == null) {
          opts = {};
        }
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
        var bot, error, robot, _i, _len;
        robot = null;
        for (_i = 0, _len = robots.length; _i < _len; _i++) {
          bot = robots[_i];
          if (bot.name === name) {
            robot = bot;
          }
        }
        if (robot == null) {
          error = {
            error: "No Robot found with the name " + name
          };
        }
        if (callback) {
          return callback(error, robot);
        } else {
          return robot;
        }
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
          var device, error;
          if (err) {
            callback(err, robot);
          }
          device = null;
          if (robot.devices[deviceid]) {
            device = robot.devices[deviceid];
          }
          if (device == null) {
            error = {
              error: "No device found with the name " + deviceid + "."
            };
          }
          if (callback) {
            return callback(error, device);
          } else {
            return device;
          }
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
          var connection, error;
          if (err) {
            callback(err, robot);
          }
          connection = null;
          if (robot.connections[connid]) {
            connection = robot.connections[connid];
          }
          if (connection == null) {
            error = {
              error: "No connection found with the name " + connid + "."
            };
          }
          if (callback) {
            return callback(error, connection);
          } else {
            return connection;
          }
        });
      };

      // Public: Starts up the API and the robots
      //
      // Returns nothing
      Master.prototype.start = function() {
        var robot, _i, _len, _results;
        this.startAPI();
        _results = [];
        for (_i = 0, _len = robots.length; _i < _len; _i++) {
          robot = robots[_i];
          _results.push(robot.start());
        }
        return _results;
      };

      // Public: Stops the API and the robots
      //
      // Returns nothing
      Master.prototype.stop = function() {
        var robot, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = robots.length; _i < _len; _i++) {
          robot = robots[_i];
          _results.push(robot.stop());
        }
        return _results;
      };

      // Creates a new instance of the Cylon API server, or returns the
      // already-existing one.
      //
      // Returns an Cylon.ApiServer instance
      Master.prototype.startAPI = function() {
        var server;
        server = require('./api');
        api_config.master = this.self;
        return api != null ? api : api = new server(api_config);
      };

      return Master;

    })();

    return Cylon;

  }).call(this);

  module.exports = Cylon.getInstance();

}).call(this);
