"use strict";

/* eslint no-use-before-define: 0 */

var Config = require("./config"),
    _ = require("./utils/helpers");

var BasicLogger = function basiclogger(str) {
  var prefix = new Date().toISOString() + " : ";
  console.log(prefix + str);
};

var NullLogger = function nulllogger() {};

var Logger = module.exports = {
  setup: setup,

  should: {
    log: true,
    debug: false
  },

  log: function log(str) {
    if (Logger.should.log) {
      Logger.logger.call(Logger.logger, str);
    }
  },

  debug: function debug(str) {
    if (Logger.should.log && Logger.should.debug) {
      Logger.logger.call(Logger.logger, str);
    }
  }
};

function setup(opts) {
  if (_.isObject(opts)) { _.extend(Config, opts); }

  var logger = Config.logger;

  // if no logger supplied, use basic logger
  if (logger == null) { logger = BasicLogger; }

  // if logger is still falsy, use NullLogger
  Logger.logger = logger || NullLogger;

  Logger.should.log = !Config.silent;
  Logger.should.debug = Config.debug;

  // --silent CLI flag overrides
  if (_.includes(process.argv, "--silent")) {
    Logger.should.log = false;
  }

  // --debug CLI flag overrides
  if (_.includes(process.argv, "--debug")) {
    Logger.should.debug = false;
  }

  return Logger;
}

setup();
Config.subscribe(setup);

// deprecated holdovers
["info", "warn", "error", "fatal"].forEach(function(method) {
  var called = false;

  function showDeprecationNotice() {
    console.log("The method Logger#" + method + " has been deprecated.");
    console.log("It will be removed in Cylon 2.0.0.");
    console.log("Please switch to using the #log or #debug Logger methods");

    called = true;
  }

  Logger[method] = function() {
    if (!called) { showDeprecationNotice(); }
    Logger.log.apply(null, arguments);
  };
});
