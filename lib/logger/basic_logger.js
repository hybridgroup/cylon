"use strict";

var getArgs = function(args) {
  return args.length >= 1 ? [].slice.call(args, 0) : [];
};

var logString = function(type) {
  var time = new Date().toISOString(),
      upcase = String(type).toUpperCase(),
      padded = String("      " + upcase).slice(-5);

  return upcase[0] + ", [" + time + "] " + padded + " -- :";
};

// The BasicLogger logs to console.log
var BasicLogger = module.exports = {
  toString: function() { return "BasicLogger"; },
};

["debug", "info", "warn", "error", "fatal"].forEach(function(type) {
  BasicLogger[type] = function() {
    var args = getArgs(arguments);
    return console.log.apply(console, [].concat(logString(type), args));
  };
});
