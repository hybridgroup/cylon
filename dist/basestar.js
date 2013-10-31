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
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

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

      Basestar.prototype.proxyEvent = function(eventName, onSource, emitSource, updEvt) {
        var _this = this;
        if (updEvt == null) {
          updEvt = false;
        }
        return onSource.on(eventName, function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          emitSource.emit(eventName, args);
          if (updEvt) {
            return emitSource.emit('update', eventName, args);
          }
        });
      };

      Basestar.prototype.proxyAdaptorEvent = function(params) {
        return this.proxyEvent(params.on, this.connector, this.connection, params.emitUpdate);
      };

      Basestar.prototype.proxyDriverEvent = function(params) {
        return this.proxyEvent(params.on, this.connection, this.device, params.emitUpdate);
      };

      Basestar.prototype.createEvent = function(onEvent, onSource, emitEvent, emitSource, updEvt) {
        var _this = this;
        if (updEvt == null) {
          updEvt = false;
        }
        return onSource.on(onEvent, function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          emitSource.emit(emitEvent, args);
          if (updEvt) {
            return emitSource.emit('update', emitEvent, args);
          }
        });
      };

      Basestar.prototype.createAdaptorEvent = function(params) {
        return this.createEvent(params.on, this.connector, params.emit, this.connection, params.emitUpdate);
      };

      Basestar.prototype.createDriverEvent = function(params) {
        return this.createEvent(params.on, this.connection, params.emit, this.device, params.emitUpdate);
      };

      return Basestar;

    })(EventEmitter);
  });

}).call(this);
