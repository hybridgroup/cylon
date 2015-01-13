/*
 * logger
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var levels = ["debug", "info", "warn", "error", "fatal"];

var BasicLogger = require("./logger/basic_logger"),
    NullLogger = require("./logger/null_logger"),
    Config = require("./config"),
    _ = require("./lodash");

var Logger = module.exports = {
  setup: function(opts) {
    if (typeof opts === "object") {
      _.merge(Config.logging, opts);
    }

    var logger = Config.logging.logger,
        level  = Config.logging.level || "info";

    logger = (logger == null) ? BasicLogger : logger;

    this.logger = logger || NullLogger;
    this.level = level;

    return this;
  },

  toString: function() {
    return this.logger.toString();
  }
};

Logger.setup();

_.each(levels, function(level) {
  Logger[level] = function() {
    if (levels.indexOf(level) >= levels.indexOf(Logger.level)) {
      return Logger.logger[level].apply(Logger.logger, arguments);
    }
  };
});
