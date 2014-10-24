// The NullLogger is designed for cases where you want absolutely nothing to
// print to anywhere. Every proxied method from the Logger returns a noop.
var NullLogger = module.exports = {
  toString: function() { return "NullLogger"; }
};

['debug', 'info', 'warn', 'error', 'fatal'].forEach(function(type) {
  NullLogger[type] = function() {};
});
