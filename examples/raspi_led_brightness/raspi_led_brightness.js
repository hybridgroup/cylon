var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi', port: '/dev/ttyACM0' },
  device: { name: 'led', driver: 'led', pin: 11 },

  work: function(my) {
    var brightness = 0;
    var fade = 5;

    every(0.05.seconds(), function() {
      brightness += fade;
      my.led.brightness(brightness);
      if ((brightness === 0) || (brightness === 255)) { fade = -fade; }
    });
  }
}).start();
