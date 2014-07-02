'use strict';

// The BasicLogger pushes stuff to console.log. Nothing more, nothing less.
var BasicLogger = module.exports = function BasicLogger() {};

BasicLogger.prototype.toString = function() {
  return "BasicLogger";
};

var getArgs = function(args) {
  return args.length >= 1 ? [].slice.call(args, 0) : [];
};

var logString = function(type) {
  var upcase = String(type).toUpperCase(),
      time = new Date().toISOString();

  var padded = String("     " + upcase).slice(-5);

  return upcase[0] + ", [" + time + "] " + padded + " -- :";
};


['debug', 'info', 'warn', 'error', 'fatal'].forEach(function(type) {
  BasicLogger.prototype[type] = function() {
    var args = getArgs(arguments);
    return console.log.apply(console, [].concat(logString(type), args));
  };
});
