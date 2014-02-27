/*
 * basestar
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

require('./utils');
var namespace = require('node-namespace');
var EventEmitter = require('events').EventEmitter;

  // Basestar is a base class to be used when writing external Cylon adaptors and
  // drivers. It provides some useful base methods and functionality
  //
  // It also extends EventEmitter, so child classes are capable of emitting events
  // for other parts of the system to handle.
namespace("Cylon", function() {
  this.Basestar = (function(klass) {
    subclass(Basestar, klass);

    function Basestar(opts) {
      this.self = this;
    }

    // Public: Proxies calls from all methods in the object to a target object
    //
    // methods - array of methods to proxy
    // target - object to proxy methods to
    // source - object to proxy methods from
    // force - whether or not to overwrite existing method definitions
    //
    // Returns the klass where the methods have been proxied
    Basestar.prototype.proxyMethods = function(methods, target, source, force) {
      if (force == null) {
        force = false;
      }
      return proxyFunctionsToObject(methods, target, source, force);
    };

    // Public: Defines an event handler that proxies events from a source object
    // to a target object
    //
    // opts - object containing options:
    //   - targetEventName or eventName - event that should be emitted from the
    //                                    target
    //   - target - object to proxy event to
    //   - source - object to proxy event from
    //   - update - whether or not to send an 'update' event
    //
    // Returns the source
    Basestar.prototype.defineEvent = function(opts) {
      var sendUpdate, targetEventName,
        _this = this;
      targetEventName = opts.targetEventName || opts.eventName;
      sendUpdate = opts.sendUpdate || false;
      opts.source.on(opts.eventName, function() {
        var args, _ref, _ref1;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        (_ref = opts.target).emit.apply(_ref, [targetEventName].concat(__slice.call(args)));
        if (sendUpdate) {
          return (_ref1 = opts.target).emit.apply(_ref1, ['update', targetEventName].concat(__slice.call(args)));
        }
      });
      return opts.source;
    };

    // Public: Creates an event handler that proxies events from an adaptor's
    // 'connector' (reference to whatever module is actually talking to the hw)
    // to the adaptor's associated connection.
    //
    // opts - hash of opts to be passed to defineEvent()
    //
    // Returns @connector
    Basestar.prototype.defineAdaptorEvent = function(opts) {
      opts['source'] = this.connector;
      opts['target'] = this.connection;
      if (opts['sendUpdate'] == null) {
        opts['sendUpdate'] = false;
      }
      return this.defineEvent(opts);
    };

    // Public: Creates an event handler that proxies events from an device's
    // 'connector' (reference to whatever module is actually talking to the hw)
    // to the device's associated connection.
    //
    // opts - hash of opts to be passed to defineEvent()
    //
    // Returns @connection
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
