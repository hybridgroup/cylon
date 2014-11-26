var Cylon = require('../..');

Cylon.robot({
  connections: {
    digispark: { adaptor: 'digispark' }
  },

  devices: {
    led: { driver: 'led', pin: 1 }
  },

  work: function(my) {
    every((1).second(), my.led.toggle);
  }
}).start();
