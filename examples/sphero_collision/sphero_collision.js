var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' },
  device: { name: 'sphero', driver: 'sphero' },

  work: function(me) {
    var color = 0x00FF00;
    var bitFilter = 0xFFFF00;

    me.sphero.on('connect', function() {
      console.log("Setting up Collision Detection...");
      me.sphero.detectCollisions();
      me.sphero.setRGB(color);
      me.sphero.stop();
    });

    me.sphero.on('collision', function(data) {
      console.log("Collision:");
      color = color ^ bitFilter;
      console.log("Color: " + (color.toString(16)) + " ");
      me.sphero.setRGB(color);
      me.sphero.roll(90, Math.floor(Math.random() * 360));
    });
  }
}).start();
