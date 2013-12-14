/*
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace;

  namespace = require('node-namespace');

  namespace('Cylon.Adaptors', function() {
    return this.Adaptor = (function() {
      function Adaptor(opts) {
        this.self = this;
        this.name = opts.name;
        this.connection = opts.connection;
      }

      Adaptor.prototype.commands = function() {
        return [];
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

    })();
  });

  module.exports = Cylon.Adaptors.Adaptor;

}).call(this);
