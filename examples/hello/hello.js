var Cylon = require('../..');

Cylon.robot({
  work: function() {
    every(1..second(), function() { Logger.info("Hello, human!"); });
    after(10..seconds(), function() { Logger.info("Impressive."); });
  }
}).start();
