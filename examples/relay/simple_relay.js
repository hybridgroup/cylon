var Cylon = require('cylon');

Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata',
               port: '/dev/ttyACM0' }
  },

  devices: {
    relay: { driver: 'relay', pin: 2, type: "closed" }
  },

  work: function(my) {
    every((1).second(), function() {
      my.relay.toggle();
    });
  }
}).start();
