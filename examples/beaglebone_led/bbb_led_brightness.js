var Cylon = require('../..');

Cylon.robot({
  connection: {
    name: 'beaglebone',
    adaptor: 'beaglebone'
  },
  device: {
    name: 'led',
    driver: 'led',
    pin: 'P9_14'
  },
  work: function(my) {
    var brightness, fade;
    brightness = 0;
    fade = 5;
    return every(0.05.seconds(), function() {
      brightness += fade;
      my.led.brightness(brightness);
      if ((brightness === 0) || (brightness === 255)) {
        return fade = -fade;
      }
    });
  }
}).start();