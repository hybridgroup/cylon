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
        this.name = opts.name;
      }

      Adaptor.prototype.commands = function() {
        return [];
      };

      Adaptor.prototype.connect = function(callback) {
        Logger.info("Connecting to adaptor '" + this.name + "'...");
        return callback(null);
      };

      Adaptor.prototype.disconnect = function() {
        return Logger.info("Disconnecting from adaptor '" + this.name + "'...");
      };

      return Adaptor;

    })();
  });

  module.exports = Cylon.Adaptors.Adaptor;

}).call(this);
