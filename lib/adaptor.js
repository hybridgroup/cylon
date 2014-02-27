/*
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

require('./basestar');
var namespace = require('node-namespace');

namespace("Cylon", function() {
  this.Adaptor = (function(klass) {
    subclass(Adaptor, klass);

    function Adaptor(opts) {
      if (opts == null) {
        opts = {};
      }
      this.self = this;
      this.name = opts.name;
      this.connection = opts.connection;
      this.commandList = [];
    }

    Adaptor.prototype.commands = function() {
      return this.commandList;
    };

    Adaptor.prototype.connect = function(callback) {
      Logger.info("Connecting to adaptor '" + this.name + "'...");
      callback(null);
      return this.connection.emit('connect');
    };

    Adaptor.prototype.disconnect = function() {
      return Logger.info("Disconnecting from adaptor '" + this.name + "'...");
    };

    return Adaptor;

  })(Cylon.Basestar);
});
