/*
 * basestar
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var EventEmitter, namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = require('node-namespace');

  EventEmitter = require('events').EventEmitter;

  require('./utils');

  namespace('Cylon', function() {
    return this.Basestar = (function(_super) {
      __extends(Basestar, _super);

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

    })(EventEmitter);
  });

}).call(this);
