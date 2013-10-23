var cylon = require('..');

cylon.robot({
  work: function() {
    every((1).second(), function() { Logger.info("hello, human!"); });
  }
}).start();
