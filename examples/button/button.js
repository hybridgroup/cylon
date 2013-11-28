var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },

  devices: [
    { name: 'led', driver: 'led', pin: 13 },
    { name: 'button', driver: 'button', pin: 2 }
  ],

  work: function(my) {
    my.button.on('push', function() {
      my.led.toggle();
    });
  }
}).start();
