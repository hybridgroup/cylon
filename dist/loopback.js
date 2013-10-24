/*
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Loopback;

  module.exports = {
    adaptor: function(opts) {
      if (opts == null) {
        opts = {};
      }
      return new Loopback(opts);
    }
  };

  Loopback = (function() {
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

    return Loopback;

  })();

}).call(this);
