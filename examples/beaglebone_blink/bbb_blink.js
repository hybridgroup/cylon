var Cylon = require('../..');

Cylon.robot({
  connection: {
    name: 'beaglebone',
    adaptor: 'beaglebone'
  },
  device: {
    name: 'led',
    driver: 'led',
    pin: 'P9_12'
  },
  work: function(my) {
    return every(1..second(), function() {
      return my.led.toggle();
    });
  }
}).start();