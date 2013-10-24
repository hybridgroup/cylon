var Cylon = require('..').instance();

Cylon.robot({
  connection: { name: 'looped', adaptor: 'loopback'},

  work: function() {
    every((1).second(), function() { Logger.info("Hello, human!"); });
    after((10).seconds(), function() { Logger.info("Impressive."); });
  }
}).start();
