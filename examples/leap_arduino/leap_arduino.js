var Cylon = require('../..');

Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
    leapmotion: { adaptor: 'leapmotion' },
  },

  devices: {
    led: { driver: 'led', pin: 13, connection: 'arduino' }
    leapmotion: { driver: 'leapmotion', connection: 'leapmotion' },
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
