/*
 * Ping driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Driver, Ping,
    __slice = [].slice;

  module.exports = {
    driver: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Driver.Ping, args, function(){});
    }
  };

  Driver = {
    Ping: Ping = (function() {
      function Ping(opts) {
        this.self = this;
        this.name = opts.name;
      }

      Ping.prototype.commands = function() {
        return ['ping'];
      };

      Ping.prototype.start = function() {
        Logger.info("Starting driver '" + this.name + "'...");
        return this.self;
      };

      Ping.prototype.ping = function() {
        return "pong";
      };

      return Ping;

    })()
  };

}).call(this);
