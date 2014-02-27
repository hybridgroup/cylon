/*
 * logger
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/



(function() {
  var BasicLogger, NullLogger,
    __slice = [].slice;

"use strict";

var getArgs = function(args) {
  return args.length >= 1 ? [].slice.call(args, 0) : [];
}
>>>>>>> c39f448d14c27cdd9a1524a11c57a5c01a345b3c

// The Logger is a global object to facilitate logging stuff to the console (or
// other output) easily and consistently. It's available anywhere in Cylon, as
// well as in external modules that are loaded into Cylon
<<<<<<< HEAD
  global.Logger = {

    // Public: Creates a Logger instance and assigns it to @logger
    //
    // logger - logger object to use. Defaults to a BasicLogger, or a NullLogger if
    // false is supplied
    //
    // Returns the new logger instance
    setup: function(logger) {
      if (logger == null) {
        logger = new BasicLogger;
      }
      return this.logger = logger === false ? new NullLogger : logger;
    },
    toString: function() {
      return this.logger.toString();
    },
    debug: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.logger).debug.apply(_ref, args);
    },
    info: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.logger).info.apply(_ref, args);
    },
    warn: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.logger).warn.apply(_ref, args);
    },
    error: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.logger).error.apply(_ref, args);
    },
    fatal: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.logger).fatal.apply(_ref, args);
=======
global.Logger = {

  // Public: Creates a Logger instance and assigns it to @logger
  //
  // logger - logger object to use. Defaults to a BasicLogger, or a NullLogger if
  // false is supplied
  //
  // Returns the new logger instance
  setup: function(logger) {
    if (logger == null) { logger = new BasicLogger; }

    if (logger === false) {
      this.logger = new NullLogger();
    } else {
      this.logger = logger;
>>>>>>> c39f448d14c27cdd9a1524a11c57a5c01a345b3c
    }

<<<<<<< HEAD
  // The BasicLogger pushes stuff to console.log. Nothing more, nothing less.
  BasicLogger = (function() {
    function BasicLogger() {}
=======
    return this.logger
  },

  toString: function() { return this.logger.toString(); },

  debug: function() {
    var args = getArgs(arguments);
    return this.logger.debug.apply(this.logger, args);
  },

  info: function() {
    var args = getArgs(arguments);
    return this.logger.info.apply(this.logger, args);
  },

  warn: function() {
    var args = getArgs(arguments);
    return this.logger.warn.apply(this.logger, args);
  },

  error: function() {
    var args = getArgs(arguments);
    return this.logger.error.apply(this.logger, args);
  },
>>>>>>> c39f448d14c27cdd9a1524a11c57a5c01a345b3c

  fatal: function() {
    var args = getArgs(arguments);
    return this.logger.fatal.apply(this.logger, args);
  }
};

// The BasicLogger pushes stuff to console.log. Nothing more, nothing less.
var BasicLogger = (function() {
  function BasicLogger() {}

  BasicLogger.prototype.toString = function() { return "BasicLogger"; };

  BasicLogger.prototype.debug = function() {
    var args = getArgs(arguments),
        string = ["D, [" + (new Date().toISOString()) + "] DEBUG -- :"],
        data = string.concat(args.slice());

    return console.log.apply(console, data);
  };

  BasicLogger.prototype.info = function() {
    var args = getArgs(arguments),
        string = ["I, [" + (new Date().toISOString()) + "]  INFO -- :"],
        data = string.concat(args.slice());

    return console.log.apply(console, data);
  };

  BasicLogger.prototype.warn = function() {
    var args = getArgs(arguments),
        string = ["W, [" + (new Date().toISOString()) + "]  WARN -- :"],
        data = string.concat(args.slice());

<<<<<<< HEAD

  // The NullLogger is designed for cases where you want absolutely nothing to
  // print to anywhere. Every proxied method from the Logger returns a noo
  NullLogger = (function() {
    function NullLogger() {}
=======
    return console.log.apply(console, data);
  };
>>>>>>> c39f448d14c27cdd9a1524a11c57a5c01a345b3c

  BasicLogger.prototype.error = function() {
    var args = getArgs(arguments),
        string = ["E, [" + (new Date().toISOString()) + "] ERROR -- :"],
        data = string.concat(args.slice());

    return console.log.apply(console, data);
  };

  BasicLogger.prototype.fatal = function() {
    var args = getArgs(arguments),
        string = ["F, [" + (new Date().toISOString()) + "] FATAL -- :"],
        data = string.concat(args.slice());

    return console.log.apply(console, data);
  };

  return BasicLogger;

})();

// The NullLogger is designed for cases where you want absolutely nothing to
// print to anywhere. Every proxied method from the Logger returns a noop.
var NullLogger = (function() {
  function NullLogger() {}

  NullLogger.prototype.toString = function() { return "NullLogger"; };

  NullLogger.prototype.debug = function() {};
  NullLogger.prototype.info = function() {};
  NullLogger.prototype.warn = function() {};
  NullLogger.prototype.error = function() {};
  NullLogger.prototype.fatal = function() {};

  return NullLogger;

})();
