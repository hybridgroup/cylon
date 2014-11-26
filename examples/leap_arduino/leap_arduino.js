var Cylon = require('../..');

Cylon.robot({
  connections: {
    leap: { adaptor: 'leapmotion' },
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13, connection: 'arduino' }
  },

  work: function(my) {
    my.leapmotion.on('frame', function(frame) {
      if (frame.hands.length > 0) {
        my.led.turnOn();
      } else {
        my.led.turnOff();
      }
    });
  }
}).start();
