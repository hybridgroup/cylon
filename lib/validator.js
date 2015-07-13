"use strict";

// validates an Object containing Robot parameters

var Logger = require("./logger"),
    _ = require("./utils/helpers");

function hasProp(object, prop) {
  return object.hasOwnProperty(prop);
}

function die() {
  var RobotDSLError = new Error("Unable to start robot due to a syntax error");
  RobotDSLError.name = "RobotDSLError";
  throw RobotDSLError;
}

function warn(messages) {
  messages = [].concat(messages);
  messages.map(function(msg) { Logger.log(msg); });
}

function fatal(messages) {
  messages = [].concat(messages);
  messages.map(function(msg) { Logger.log(msg); });
  die();
}

var checks = {};

checks.singleObjectSyntax = function(opts, key) {
  var single = hasProp(opts, key),
      plural = hasProp(opts, key + "s");

  if (single && !plural) {
    fatal([
      "The single-object '" + key + "' syntax for robots is not valid.",
      "Instead, use the multiple-value '" + key + "s' key syntax.",
      "Details: http://cylonjs.com/documentation/guides/working-with-robots/"
    ]);
  }
};

checks.singleObjectSyntax = function(opts) {
  ["connection", "device"].map(function(key) {
    var single = hasProp(opts, key),
        plural = hasProp(opts, key + "s");

    if (single && !plural) {
      fatal([
        "The single-object '" + key + "' syntax for robots is not valid.",
        "Instead, use the multiple-value '" + key + "s' key syntax.",
        "Details: http://cylonjs.com/documentation/guides/working-with-robots/"
      ]);
    }
  });
};

checks.deviceWithoutDriver = function(opts) {
  if (opts.devices) {
    _.each(opts.devices, function(device, name) {
      if (!device.driver || device.driver === "") {
        fatal("No driver supplied for device " + name);
      }
    });
  }
};

checks.devicesWithoutConnection = function(opts) {
  var connections = opts.connections,
      devices = opts.devices;

  if (devices && connections && Object.keys(connections).length > 1) {
    var first = Object.keys(connections)[0];

    _.each(devices, function(device, name) {
      if (!device.connection || device.connection === "") {
        warn([
          "No explicit connection provided for device " + name,
          "Will default to using connection " + first
        ]);
      }
    });
  }
};

checks.noConnections = function(opts) {
  var connections = Object.keys(opts.connections || {}).length,
      devices = Object.keys(opts.devices || {}).length;

  if (devices && !connections) {
    fatal(["No connections provided for devices"]);
  }
};

module.exports.validate = function validate(opts) {
  opts = opts || {};

  _.each(checks, function(check) {
    check(opts);
  });
};
