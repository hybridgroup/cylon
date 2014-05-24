/*
 * logger
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var getArgs = function(args) {
  return args.length >= 1 ? [].slice.call(args, 0) : [];
};

var BasicLogger = require('./logger/basic_logger'),
    NullLogger = require('./logger/null_logger');

// The Logger is a global object to facilitate logging stuff to the console (or
// other output) easily and consistently. It's available anywhere in Cylon, as
// well as in external modules that are loaded into Cylon
var Logger = module.exports = {};

// Public: Creates a Logger instance and assigns it to @logger
//
// logger - logger object to use. Defaults to a BasicLogger, or a NullLogger if
// false is supplied
//
// Returns the new logger instance
Logger.setup = function setup(logger) {
  if (logger == null) { logger = new BasicLogger(); }

  if (logger === false) {
    this.logger = new NullLogger();
  } else {
    this.logger = logger;
  }

  return this.logger;
};

Logger.toString = function() {
  return this.logger.toString();
};

Logger.debug = function() {
  var args = getArgs(arguments);
  return this.logger.debug.apply(this.logger, args);
};

Logger.info = function() {
  var args = getArgs(arguments);
  return this.logger.info.apply(this.logger, args);
};

Logger.warn = function() {
  var args = getArgs(arguments);
  return this.logger.warn.apply(this.logger, args);
};

Logger.error = function() {
  var args = getArgs(arguments);
  return this.logger.error.apply(this.logger, args);
};

Logger.fatal = function() {
  var args = getArgs(arguments);
  return this.logger.fatal.apply(this.logger, args);
};
