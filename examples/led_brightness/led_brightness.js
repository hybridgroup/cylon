var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'led', driver: 'led', pin: 3 },

  work: function(my) {
    var brightness = 0;
    var fade = 5;

    every(0.05.seconds(), function() {
      brightness += fade;
      my.led.brightness(brightness);
      if ((brightness === 0) || (brightness === 255)) {
        fade = -fade;
      }
    });
  }
}).start();
