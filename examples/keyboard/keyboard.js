var Cylon = require('../..');

Cylon.robot({
  connections: {
    keyboard: { adaptor: 'keyboard' }
  },

  devices: {
    keyboard: { driver: 'keyboard' }
  },

  work: function(my) {
    my.keyboard.on('a', function(key) {
      console.log("a pressed!");
    });
  }
}).start();
