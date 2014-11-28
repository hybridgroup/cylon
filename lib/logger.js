/*
 * logger
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var levels = ["debug", "info", "warn", "error", "fatal"];

var BasicLogger = require('./logger/basic_logger'),
    NullLogger = require('./logger/null_logger'),
    Config = require('./config');

// The Logger is a global object to facilitate logging stuff to the console (or
// other output) easily and consistently. It's available anywhere in Cylon, as
// well as in external modules that are loaded into Cylon
var Logger = module.exports = {};

// Public: Creates a Logger instance and assigns it to @logger
//
// logger - logger object to use. Defaults to a BasicLogger, or a NullLogger if
// false is supplied
//
// level - logging level to use. if supplied, will only log to specified level
// or above
//
// Returns the new logger instance
Logger.setup = function setup(opts) {
  var Cylon = require('./cylon');

  if (typeof opts === 'object') {
    Cylon.config({ logging: opts });
  }

  var logger = Config.logging.logger,
      level  = Config.logging.level || "info";

  if (logger == null) { logger = BasicLogger; }

  this.logger = logger || NullLogger;

  if (typeof level === 'string') {
    setLogLevel(level);
  }

  return this.logger;
};

Logger.toString = function() {
  return this.logger.toString();
};

levels.forEach(function(level) {
  Logger[level] = function() {
    return this.logger[level].apply(this.logger, arguments);
  };
});

var setLogLevel = function(level) {
  var index = levels.indexOf(level),
      active,
      ignored;

  if (index < 0) {
    throw new Error("Invalid Log Level specified: " + level);
  }

  active = levels.slice(index);
  ignored = levels.slice(0, index);

  active.forEach(function(level) {
    Logger[level] = function() {
      return this.logger[level].apply(this.logger, arguments);
    };
  });

  ignored.forEach(function(level) {
    Logger[level] = function() {};
  });
}

Logger.setup();

