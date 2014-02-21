var Cylon = require('../..');

Cylon.robot({
  connection: {
    name: 'digispark',
    adaptor: 'digispark'
  },
  device: {
    name: 'led',
    driver: 'led',
    pin: 1
  },
  work: function(my) {
    return every(1..second(), function() {
      return my.led.toggle();
    });
  }
}).start();