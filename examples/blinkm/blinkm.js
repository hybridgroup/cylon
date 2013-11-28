var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },

  device: { name: 'blinkm', driver: 'blinkm' },

  work: function(my) {
    my.blinkm.on('start', function() {
      my.blinkm.version(function(version) {
        Logger.info("Started BlinkM version " + version);
      });

      my.blinkm.off();

      var lit = false;

      every((1).second(), function() {
        if (lit) {
          lit = false;
          Logger.info('on');
          my.blinkm.rgb(0xaa, 0, 0);
        } else {
          lit = true;
          Logger.info('off');
          my.blinkm.rgb(0, 0, 0);
        }
      });
    });
  }
}).start();
