"use strict";

// validates an Object containing Robot parameters

var Logger = require("./logger");

function hasProp(object, prop) {
  return object.hasOwnProperty(prop);
}

function die() {
  var RobotDSLError = new Error("Unable to start robot due to a syntax error");
  RobotDSLError.name = "RobotDSLError";
  throw RobotDSLError;
}

function log(messages) {
  messages = [].concat(messages);
  messages.map(function(msg) { Logger.fatal(msg); });
}

var check = {};

check.singleObjectSyntax = function(opts, key) {
  var single = hasProp(opts, key),
      plural = hasProp(opts, key + "s");

  if (single && !plural) {
    log([
      "The single-object '" + key + "' syntax for robots is not valid.",
      "Instead, use the multiple-value '" + key + "s' key syntax.",
      "Details: http://cylonjs.com/documentation/guides/working-with-robots/"
    ]);

    die();
  }
};

module.exports.validate = function validate(opts) {
  opts = opts || {};

  ["connection", "device"].map(function(type) {
    check.singleObjectSyntax(opts, type);
  });
};
