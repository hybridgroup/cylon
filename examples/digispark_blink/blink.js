var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'digispark', adaptor: 'digispark' },
  device: { name: 'led', driver: 'led', pin: 1 },

  work: function(my) {
    every((1).second(), my.led.toggle);
  }
}).start();
