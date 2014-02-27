/*
 * driver
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require('./basestar');
var namespace = require('node-namespace');

namespace("Cylon", function() {
  this.Driver = (function(klass) {
    subclass(Driver, klass);

    function Driver(opts) {
      if (opts == null) {
        opts = {};
      }
      this.self = this;
      this.name = opts.name;
      this.device = opts.device;
      this.connection = this.device.connection;
      this.commandList = [];
    }

    Driver.prototype.commands = function() {
      return this.commandList;
    };

    Driver.prototype.start = function(callback) {
      Logger.info("Driver " + this.name + " started");
      callback(null);
      this.device.emit('start');
      return true;
    };

    Driver.prototype.stop = function() {
      return Logger.info("Driver " + this.name + " stopped");
    };

    return Driver;

  })(Cylon.Basestar);
});
