var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: {name: 'led', driver: 'led', pin: 13},

  work: function(my) {
    every((1).seconds(), function() {my.led.toggle()});
  }
}).start();
