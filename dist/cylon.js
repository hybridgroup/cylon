/*
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Cylon, readLine,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require('./utils');

  require('./logger');

  require('./api');

  readLine = require("readline");

  Logger.setup();

  Cylon = (function() {
    var Master, instance;

    function Cylon() {}

    instance = null;

    Cylon.getInstance = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return instance != null ? instance : instance = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Master, args, function(){});
    };

    Master = (function() {
      var api, api_config, robots;

      robots = [];

      api = null;

      api_config = {
        host: '127.0.0.1',
        port: '3000'
      };

      function Master() {
        this.robot = __bind(this.robot, this);
        var rl;
        this.self = this;
        if (process.platform === "win32") {
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
          return process.exit();
        });
      }

      Master.prototype.robot = function(opts) {
        var Robot, robot;
        Robot = require("./robot");
        opts.master = this;
        robot = new Robot(opts);
        robots.push(robot);
        return robot;
      };

      Master.prototype.robots = function() {
        return robots;
      };

      Master.prototype.api = function(opts) {
        api_config.host = opts.host || "127.0.0.1";
        api_config.port = opts.port || "3000";
        return api_config;
      };

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

      Master.prototype.findRobotDevice = function(robotid, deviceid, callback) {
        return this.findRobot(robotid, function(err, robot) {
          var device, error;
          if (err) {
            callback(err, robot);
          }
          if (robot.devices[deviceid]) {
            device = robot.devices[deviceid];
          }
          if (device == null) {
            error = {
              error: "No device found with the name " + device + "."
            };
          }
          if (callback) {
            return callback(error, device);
          } else {
            return device;
          }
        });
      };

      Master.prototype.findRobotConnection = function(robotid, connid, callback) {
        return this.findRobot(robotid, function(err, robot) {
          var connection, error;
          if (err) {
            callback(err, robot);
          }
          if (robot.connections[connid]) {
            connection = robot.connections[connid];
          }
          if (connection == null) {
            error = {
              error: "No connection found with the name " + connection + "."
            };
          }
          if (callback) {
            return callback(error, connection);
          } else {
            return connection;
          }
        });
      };

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

      Master.prototype.stop = function() {
        var robot, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = robots.length; _i < _len; _i++) {
          robot = robots[_i];
          _results.push(robot.stop());
        }
        return _results;
      };

      Master.prototype.startAPI = function() {
        api_config.master = this.self;
        return api != null ? api : api = new Api.Server(api_config);
      };

      return Master;

    })();

    return Cylon;

  }).call(this);

  module.exports = Cylon.getInstance();

}).call(this);
