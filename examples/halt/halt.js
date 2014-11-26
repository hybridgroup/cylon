var Cylon = require('../..');

Cylon.robot({
  connections: {
    loopback: { adaptor: 'loopback' }
  },

  devices: {
    ping: { driver: 'ping' }
  },

  work: function(my) {
    after((1).second(), function() {
      console.log("Hello human!");
      console.log("I'm going to automatically stop in a few seconds.");
    });

    after((5).seconds(), function() {
      console.log("I'm shutting down now.");
      Cylon.halt();
    });
  }
});

Cylon.start();
