var Cylon = require('../..');

Cylon.robot({
  connection: {
    name: 'spark',
    adaptor: 'spark',
    deviceId: '',
    accessToken: ''
  },

  device: {
    name: 'led',
    driver: 'led',
    pin: 'D7'
  },

  work: function(my) {
    every(1..second(), function() { my.led.toggle(); });
  }
}).start();
