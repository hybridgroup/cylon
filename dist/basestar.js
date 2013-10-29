/*
 * basestar
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace;

  namespace = require('node-namespace');

  require('./utils');

  namespace('Cylon', function() {
    return this.Basestar = (function() {
      function Basestar(opts) {
        this.self = this;
      }

      Basestar.prototype.proxyMethods = function(methods, target, klass, force) {
        if (force == null) {
          force = false;
        }
        return proxyFunctionsToObject(methods, target, klass, force);
      };

      return Basestar;

    })();
  });

}).call(this);
