/*
 * Ping driver
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
      })(Cylon.Drivers.Ping, args, function(){});
    }
  };

  namespace('Cylon.Drivers', function() {
    var _ref;
    return this.Ping = (function(_super) {
      __extends(Ping, _super);

      function Ping() {
        _ref = Ping.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Ping.prototype.commands = function() {
        return ['ping'];
      };

      Ping.prototype.ping = function() {
        return "pong";
      };

      return Ping;

    })(Cylon.Driver);
  });

}).call(this);
