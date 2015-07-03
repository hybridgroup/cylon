"use strict";

var Basestar = require("./basestar"),
    Utils = require("./utils"),
    _ = require("./utils/helpers");

function formatErrorMessage(name, message) {
  return ["Error in driver", "'" + name + "'", "- " + message].join(" ");
}

/**
 * Driver class
 *
 * @constructor Driver
 * @param {Object} [opts] driver options
 * @param {String} [opts.name] the driver's name
 * @param {Object} [opts.robot] the robot the driver belongs to
 * @param {Object} [opts.connection] the adaptor the driver works through
 * @param {Number} [opts.pin] the pin number the driver should have
 * @param {Number} [opts.interval=10] read interval in milliseconds
 */
var Driver = module.exports = function Driver(opts) {
  Driver.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.name = opts.name;
  this.robot = opts.robot;

  this.connection = opts.connection;

  this.commands = {};
  this.events = [];

  // some default options
  this.pin = opts.pin;
  this.interval = opts.interval || 10;

  this.details = {};

  _.each(opts, function(opt, name) {
    var banned = ["robot", "name", "connection", "driver", "events"];

    if (!_.includes(banned, name)) {
      this.details[name] = opt;
    }
  }, this);
};

Utils.subclass(Driver, Basestar);

/**
 * A base start function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Driver.prototype.start = function() {
  var message = formatErrorMessage(
    this.name,
    "Driver#start method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * A base halt function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Driver.prototype.halt = function() {
  var message = formatErrorMessage(
    this.name,
    "Driver#halt method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * Sets up an array of commands for the Driver.
 *
 * Proxies commands from the Driver to its connection (or a manually specified
 * proxy), and adds a snake_cased version to the driver's commands object.
 *
 * @param {String[]} commands an array of driver commands
 * @param {Object} [proxy=this.connection] proxy target
 * @return {void}
 */
Driver.prototype.setupCommands = function(commands, proxy) {
  if (proxy == null) {
    proxy = this.connection;
  }

  Utils.proxyFunctionsToObject(commands, proxy, this);

  function endsWith(string, substr) {
    return string.indexOf(substr, string.length - substr.length) !== -1;
  }

  commands.forEach(function(command) {
    var snakeCase = command.replace(/[A-Z]+/g, function(match) {
      if (match.length > 1 && !endsWith(command, match)) {
        match = match.replace(/[A-Z]$/, function(m) {
          return "_" + m.toLowerCase();
        });
      }

      return "_" + match.toLowerCase();
    }).replace(/^_/, "");

    this.commands[snakeCase] = this[command];
  }, this);
};

/**
 * Expresses the Driver in a JSON-serializable format
 *
 * @return {Object} a representation of the Driver in a serializable format
 */
Driver.prototype.toJSON = function() {
  return {
    name: this.name,
    driver: this.constructor.name || this.name,
    connection: this.connection.name,
    commands: Object.keys(this.commands),
    events: this.events,
    details: this.details
  };
};
