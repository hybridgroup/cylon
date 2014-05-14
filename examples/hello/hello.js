var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'loopback', adaptor: 'loopback' },
  device: { name: 'ping', driver: 'ping' },

  commands: ['test'],

  test: function(greeting) {
    return greeting + " world";
  },

  work: function() {
    every((60).seconds(), console.log);
  }
});

Cylon.start();
