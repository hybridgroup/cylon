/*
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Cylon, Robot,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Robot = require("./robot");

  require('./utils');

  require('./logger');

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
      var robots;

      function Master() {
        this.robot = __bind(this.robot, this);
      }

      robots = [];

      Master.prototype.robot = function(opts) {
        var robot;
        opts.master = this;
        robot = new Robot(opts);
        robots.push(robot);
        return robot;
      };

      Master.prototype.start = function() {
        var robot, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = robots.length; _i < _len; _i++) {
          robot = robots[_i];
          _results.push(robot.start());
        }
        return _results;
      };

      return Master;

    })();

    return Cylon;

  }).call(this);

  module.exports = Cylon.getInstance();

}).call(this);
