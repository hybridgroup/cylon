/*
 * Loopback adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Adaptor, Loopback,
    __slice = [].slice;

  module.exports = {
    adaptor: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Adaptor.Loopback, args, function(){});
    }
  };

  Adaptor = {
    Loopback: Loopback = (function() {
      function Loopback(opts) {
        this.self = this;
        this.name = opts.name;
      }

      Loopback.prototype.connect = function() {
        Logger.info("Connecting to adaptor '" + this.name + "'...");
        return this.self;
      };

      Loopback.prototype.disconnect = function() {
        return Logger.info("Disconnecting from adaptor '" + this.name + "'...");
      };

      Loopback.prototype.commands = function() {
        return ['ping'];
      };

      return Loopback;

    })()
  };

}).call(this);
