"use strict";

var Basestar = require("./basestar"),
    Utils = require("./utils"),
    _ = require("./utils/helpers");

function formatErrorMessage(name, message) {
  return ["Error in connection", "'" + name + "'", "- " + message].join(" ");
}

/**
 * Adaptor class
 *
 * @constructor Adaptor
 *
 * @param {Object} [opts] adaptor options
 * @param {String} [opts.name] the adaptor's name
 * @param {Object} [opts.robot] the robot the adaptor belongs to
 * @param {Object} [opts.host] the host the adaptor will connect to
 * @param {Object} [opts.port] the port the adaptor will connect to
 */
var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.name = opts.name;

  // the Robot the adaptor belongs to
  this.robot = opts.robot;

  // some default options
  this.host = opts.host;
  this.port = opts.port;

  // misc. details provided in args hash
  this.details = {};

  _.each(opts, function(opt, name) {
    if (!_.includes(["robot", "name", "adaptor", "events"], name)) {
      this.details[name] = opt;
    }
  }, this);
};

Utils.subclass(Adaptor, Basestar);

/**
 * A base connect function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Adaptor.prototype.connect = function() {
  var message = formatErrorMessage(
    this.name,
    "Adaptor#connect method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * A base disconnect function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Adaptor.prototype.disconnect = function() {
  var message = formatErrorMessage(
    this.name,
    "Adaptor#disconnect method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * Expresses the Adaptor in a JSON-serializable format
 *
 * @return {Object} a representation of the Adaptor in a serializable format
 */
Adaptor.prototype.toJSON = function() {
  return {
    name: this.name,
    adaptor: this.constructor.name || this.name,
    details: this.details
  };
};
