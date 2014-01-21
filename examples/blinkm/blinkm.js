var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },

  device: { name: 'blinkm', driver: 'blinkm' },

  work: function(my) {
    my.blinkm.on('start', function() {

      my.blinkm.stopScript();

      my.blinkm.getFirmware(function(version) {
        Logger.info("Started BlinkM version " + version);
      });

      my.blinkm.goToRGB(0,0,0);
      my.blinkm.getRGBColor(function(data){
        console.log("Starting Color: ", data)
      });

      every((2).second(), function() {
        my.blinkm.getRGBColor(function(data){
          console.log("Current Color: ", data);
        });
        my.blinkm.fadeToRandomRGB(128, 128, 128);
      });
    });
  }
}).start();
