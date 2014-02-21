var Cylon = require('../..');

Cylon.robot({
  connection: {
    name: 'raspi',
    adaptor: 'raspi'
  },
  device: {
    name: 'pixel',
    driver: 'blinkm'
  },
  work: function(my) {
    var color;
    my.pixel.stopScript();
    my.pixel.goToRGB(255, 0, 0);
    my.pixel.fadeToRGB(0, 255, 0);
    my.pixel.fadeToRGB(0, 0, 255);
    color = my.pixel.getRGBColor();
    console.log(color);
    return my.pixel.getRGBColor(function(err, data) {
      if (err == null) {
        return console.log(data);
      }
    });
  }
}).start();