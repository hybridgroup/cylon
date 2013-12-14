/*
 * Loopback adaptor
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
      })(Cylon.Adaptors.Loopback, args, function(){});
    }
  };

  namespace('Cylon.Adaptors', function() {
    return this.Loopback = (function(_super) {
      __extends(Loopback, _super);

      function Loopback(opts) {
        this.self = this;
        this.name = opts.name;
      }

      Loopback.prototype.connect = function(callback) {
        Logger.info("Connecting to adaptor '" + this.name + "'...");
        callback(null);
        return this.connection.emit('connect');
      };

      Loopback.prototype.disconnect = function() {
        return Logger.info("Disconnecting from adaptor '" + this.name + "'...");
      };

      Loopback.prototype.commands = function() {
        return ['ping'];
      };

      return Loopback;

    })(this.Adaptor);
  });

}).call(this);
