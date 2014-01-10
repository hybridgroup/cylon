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

  global.Logger = {
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
    }
  };

  BasicLogger = (function() {
    function BasicLogger() {}

    BasicLogger.prototype.toString = function() {
      return "BasicLogger";
    };

    BasicLogger.prototype.debug = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.log.apply(console, ["D, [" + (new Date().toISOString()) + "] DEBUG -- :"].concat(__slice.call(args)));
    };

    BasicLogger.prototype.info = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.log.apply(console, ["I, [" + (new Date().toISOString()) + "]  INFO -- :"].concat(__slice.call(args)));
    };

    BasicLogger.prototype.warn = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.log.apply(console, ["W, [" + (new Date().toISOString()) + "]  WARN -- :"].concat(__slice.call(args)));
    };

    BasicLogger.prototype.error = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.log.apply(console, ["E, [" + (new Date().toISOString()) + "] ERROR -- :"].concat(__slice.call(args)));
    };

    BasicLogger.prototype.fatal = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.log.apply(console, ["F, [" + (new Date().toISOString()) + "] FATAL -- :"].concat(__slice.call(args)));
    };

    return BasicLogger;

  })();

  NullLogger = (function() {
    function NullLogger() {}

    NullLogger.prototype.toString = function() {
      return "NullLogger";
    };

    NullLogger.prototype.debug = function() {};

    NullLogger.prototype.info = function() {};

    NullLogger.prototype.warn = function() {};

    NullLogger.prototype.error = function() {};

    NullLogger.prototype.fatal = function() {};

    return NullLogger;

  })();

}).call(this);
