var Cylon = require('../..');

Cylon.robot({
  connections: [{ name: 'leapmotion', adaptor: 'leapmotion', port: '127.0.0.1:6437' },
    { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }],

  devices: [{ name: 'leapmotion', driver: 'leapmotion', connection: 'leapmotion' },
    { name: 'led', driver: 'led', pin: 13, connection: 'arduino' }],

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
