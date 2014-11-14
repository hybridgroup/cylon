/*
 * basestar
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var EventEmitter = require('events').EventEmitter;

var Utils = require('./utils');

// Basestar is a base class to be used when writing external Cylon adaptors and
// drivers. It provides some useful base methods and functionality
//
// It also extends EventEmitter, so child classes are capable of emitting events
// for other parts of the system to handle.
var Basestar = module.exports = function Basestar() {
};

Utils.subclass(Basestar, EventEmitter);

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

  return Utils.proxyFunctionsToObject(methods, target, source, force);
};

// Public: Defines an event handler that proxies events from a source object
// to a target object
//
// opts - object containing options:
//   - targetEventName or eventName - event that should be emitted from the
//                                    target
//   - target - object to proxy event to
//   - source - object to proxy event from
//   - sendUpdate - whether or not to send an 'update' event
//
// Returns the source
Basestar.prototype.defineEvent = function(opts) {
  opts.sendUpdate = opts.sendUpdate || false;
  opts.targetEventName = opts.targetEventName || opts.eventName;

  opts.source.on(opts.eventName, function() {
    var args = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
    args.unshift(opts.targetEventName);
    opts.target.emit.apply(opts.target, args);

    if (opts.sendUpdate) {
      args.unshift('update');
      opts.target.emit.apply(opts.target, args);
    }
  });

  return opts.source;
};

// Public: Creates an event handler that proxies events from an adaptor's
// 'connector' (reference to whatever module is actually talking to the hw)
// to the adaptor
//
// opts - hash of opts to be passed to defineEvent()
//
// Returns this.connector
Basestar.prototype.defineAdaptorEvent = function(opts) {
  return this._proxyEvents(opts, this.connector, this);
};

// Public: Creates an event handler that proxies events from a driver's
// connection to the driver
//
// opts - hash of opts to be passed to defineEvent()
//
// Returns this.connection
Basestar.prototype.defineDriverEvent = function(opts) {
  return this._proxyEvents(opts, this.connection, this);
};

Basestar.prototype._proxyEvents = function(opts, source, target) {
  opts = (typeof opts === 'string') ? { eventName: opts } : opts;

  opts.source = source;
  opts.target = target

  return this.defineEvent(opts);
}
