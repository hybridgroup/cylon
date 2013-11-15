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

  namespace('Cylon', function() {
    return this.Driver = (function() {
      function Driver(opts) {
        this.self = this;
        this.name = opts.name;
      }

      Driver.prototype.start = function() {
        return Logger.info("started");
      };

      Driver.prototype.commands = function() {
        return ['smile', 'laugh', 'help'];
      };

      return Driver;

    })();
  });

  module.exports = Cylon.Driver;

}).call(this);
