var Cylon = require('../..');

Cylon.robot({
  connection: {
    name: 'beaglebone',
    adaptor: 'beaglebone'
  },
  devices: [
    {
      name: 'led',
      driver: 'led',
      pin: 'P9_12'
    }, {
      name: 'button',
      driver: 'button',
      pin: 'P9_14'
    }
  ],
  work: function(my) {
    return my.button.on('push', function() {
      return my.led.toggle();
    });
  }
}).start();