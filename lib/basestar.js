"use strict";

var EventEmitter = require("events").EventEmitter;

var Utils = require("./utils"),
    _ = require("./utils/helpers");

/**
 * The Basestar class is a wrapper class around EventEmitter that underpins most
 * other Cylon adaptor/driver classes, providing useful external base methods
 * and functionality.
 *
 * @constructor Basestar
 */
var Basestar = module.exports = function Basestar() {
  Utils.classCallCheck(this, Basestar);
};

Utils.subclass(Basestar, EventEmitter);

/**
 * Proxies calls from all methods in the source to a target object
 *
 * @param {String[]} methods methods to proxy
 * @param {Object} target object to proxy methods to
 * @param {Object} source object to proxy methods from
 * @param {Boolean} [force=false] whether or not to overwrite existing methods
 * @return {Object} the source
 */
Basestar.prototype.proxyMethods = Utils.proxyFunctionsToObject;

/**
 * Triggers the provided callback, and emits an event with the provided data.
 *
 * If an error is provided, emits the 'error' event.
 *
 * @param {String} event what event to emit
 * @param {Function} callback function to be invoked with error/data
 * @param {*} err possible error value
 * @param {...*} data data values to be passed to error/callback
 * @return {void}
 */
Basestar.prototype.respond = function(event, callback, err) {
  var args = Array.prototype.slice.call(arguments, 3);

  if (err) {
    this.emit("error", err);
  } else {
    this.emit.apply(this, [event].concat(args));
  }

  if (typeof callback === "function") {
    callback.apply(this, [err].concat(args));
  }
};

/**
 * Defines an event handler to proxy events from a source object to a target
 *
 * @param {Object} opts event options
 * @param {EventEmitter} opts.source source of events to listen for
 * @param {EventEmitter} opts.target target new events should be emitted from
 * @param {String} opts.eventName name of event to listen for, and proxy
 * @param {Bool} [opts.sendUpdate=false] whether to emit the 'update' event
 * @param {String} [opts.targetEventName] new event name to emit from target
 * @return {EventEmitter} the source object
 */
Basestar.prototype.defineEvent = function(opts) {
  opts.sendUpdate = opts.sendUpdate || false;
  opts.targetEventName = opts.targetEventName || opts.eventName;

  opts.source.on(opts.eventName, function() {
    var args = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
    args.unshift(opts.targetEventName);
    opts.target.emit.apply(opts.target, args);

    if (opts.sendUpdate) {
      args.unshift("update");
      opts.target.emit.apply(opts.target, args);
    }
  });

  return opts.source;
};

/**
 * A #defineEvent shorthand for adaptors.
 *
 * Proxies events from an adaptor's connector to the adaptor itself.
 *
 * @param {Object} opts proxy options
 * @return {EventEmitter} the adaptor's connector
 */
Basestar.prototype.defineAdaptorEvent = function(opts) {
  return this._proxyEvents(opts, this.connector, this);
};

/**
 * A #defineEvent shorthand for drivers.
 *
 * Proxies events from an driver's connection to the driver itself.
 *
 * @param {Object} opts proxy options
 * @return {EventEmitter} the driver's connection
 */
Basestar.prototype.defineDriverEvent = function(opts) {
  return this._proxyEvents(opts, this.connection, this);
};

Basestar.prototype._proxyEvents = function(opts, source, target) {
  opts = _.isString(opts) ? { eventName: opts } : opts;

  opts.source = source;
  opts.target = target;

  return this.defineEvent(opts);
};
