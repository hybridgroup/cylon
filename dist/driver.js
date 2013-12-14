/*
 * driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace;

  namespace = require('node-namespace');

  namespace('Cylon.Drivers', function() {
    return this.Driver = (function() {
      function Driver(opts) {
        this.self = this;
        this.name = opts.name;
      }

      Driver.prototype.start = function() {
        return Logger.info("Driver " + this.name + " started");
      };

      Driver.prototype.stop = function() {
        return Logger.info("Driver " + this.name + " stopped");
      };

      Driver.prototype.commands = function() {
        return [];
      };

      return Driver;

    })();
  });

  module.exports = Cylon.Drivers.Driver;

}).call(this);
