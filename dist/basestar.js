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

  require('./utils');

  namespace = require('node-namespace');

  EventEmitter = require('events').EventEmitter;

  namespace('Cylon', function() {
    return this.Basestar = (function(_super) {
      __extends(Basestar, _super);

      function Basestar(opts) {
        this.self = this;
      }

      Basestar.prototype.proxyMethods = function(methods, target, source, force) {
        if (force == null) {
          force = false;
        }
        return proxyFunctionsToObject(methods, target, source, force);
      };

      Basestar.prototype.defineEvent = function(opts) {
        var sendUpdate, targetEventName,
          _this = this;
        targetEventName = opts.targetEventName || opts.eventName;
        sendUpdate = opts.sendUpdate || false;
        opts.source.on(opts.eventName, function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          opts.target.emit(targetEventName, args);
          if (sendUpdate) {
            return opts.target.emit('update', targetEventName, args);
          }
        });
        return opts.source;
      };

      Basestar.prototype.defineAdaptorEvent = function(opts) {
        opts['source'] = this.connector;
        opts['target'] = this.connection;
        if (opts['sendUpdate'] == null) {
          opts['sendUpdate'] = false;
        }
        return this.defineEvent(opts);
      };

      Basestar.prototype.defineDriverEvent = function(opts) {
        opts['source'] = this.connection;
        opts['target'] = this.device;
        if (opts['sendUpdate'] == null) {
          opts['sendUpdate'] = true;
        }
        return this.defineEvent(opts);
      };

      return Basestar;

    })(EventEmitter);
  });

}).call(this);
