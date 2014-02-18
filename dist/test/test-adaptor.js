/*
 * Test adaptor
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
    adaptor: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Cylon.Adaptors.TestAdaptor, args, function(){});
    }
  };

  namespace('Cylon.Adaptors', function() {
    return this.TestAdaptor = (function(_super) {
      var method, _fn, _i, _len, _ref;

      __extends(TestAdaptor, _super);

      function TestAdaptor(opts) {
        if (opts == null) {
          opts = {};
        }
        TestAdaptor.__super__.constructor.apply(this, arguments);
        this.commandList = [];
      }

      TestAdaptor.prototype.commands = function() {
        return this.commandList;
      };

      TestAdaptor.prototype.proxyTestCommands = function(realAdaptor) {};

      _ref = realAdaptor.commands();
      _fn = function(method) {
        this.self[method] = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return this.self.success();
        };
        return this.commandList.push(method);
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        _fn(method);
      }

      TestAdaptor.prototype.success = function() {
        return true;
      };

      return TestAdaptor;

    })(Cylon.Adaptor);
  });

}).call(this);
