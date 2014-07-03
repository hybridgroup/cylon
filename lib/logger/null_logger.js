// The NullLogger is designed for cases where you want absolutely nothing to
// print to anywhere. Every proxied method from the Logger returns a noop.
var NullLogger = module.exports = function NullLogger() {};

NullLogger.prototype.toString = function() {
  return "NullLogger";
};

NullLogger.prototype.debug = function() {};
NullLogger.prototype.info = function() {};
NullLogger.prototype.warn = function() {};
NullLogger.prototype.error = function() {};
NullLogger.prototype.fatal = function() {};
