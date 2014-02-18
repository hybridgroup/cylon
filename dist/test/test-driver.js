/*
 * Test driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = require('node-namespace');

  module.exports = {
    driver: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Cylon.Drivers.TestDriver, args, function(){});
    }
  };

  namespace('Cylon.Drivers', function() {
    return this.TestDriver = (function(_super) {
      __extends(TestDriver, _super);

      function TestDriver(opts) {
        if (opts == null) {
          opts = {};
        }
        TestDriver.__super__.constructor.apply(this, arguments);
        this.commandList = [];
      }

      TestDriver.prototype.commands = function() {
        return this.commandList;
      };

      TestDriver.prototype.proxyTestCommands = function(realDriver) {
        var method, _i, _len, _ref, _results;
        _ref = realDriver.commands();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          method = _ref[_i];
          this.self[method] = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.self.success();
          };
          _results.push(this.commandList.push(method));
        }
        return _results;
      };

      TestDriver.prototype.success = function() {
        return true;
      };

      return TestDriver;

    })(Cylon.Driver);
  });

}).call(this);
