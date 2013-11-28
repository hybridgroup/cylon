var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' },
  device: { name: 'sphero', driver: 'sphero' },

  work: function(me) {
    every((1).second(), function() {
      me.sphero.roll(60, Math.floor(Math.random() * 360));
    });
  }
}).start();
