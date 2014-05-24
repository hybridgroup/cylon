// The BasicLogger pushes stuff to console.log. Nothing more, nothing less.
var BasicLogger = module.exports = function BasicLogger() {}

BasicLogger.prototype.toString = function() {
  return "BasicLogger";
};

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

  return console.log.apply(console, data);
};

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

var getArgs = function(args) {
  return args.length >= 1 ? [].slice.call(args, 0) : [];
};
