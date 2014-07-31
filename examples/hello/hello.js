var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'loopback', adaptor: 'loopback' },
  device: { name: 'ping', driver: 'ping' },

  work: function() {
    every((1).seconds(), function(){
      console.log("Hello, human!")
    });

    after((5).seconds(), function(){
      console.log("I've been at your command for 5 seconds now.")
    });
  }
});

Cylon.start();
