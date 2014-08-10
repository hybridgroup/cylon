var Cylon = require('../..');

Cylon.api();

Cylon.robot({
  name: 'test',
  connection: { name: 'loopback', adaptor: 'loopback' },
  device: { name: 'ping', driver: 'ping' },

  work: function(my) {
    every((1).seconds(), function(){
      console.log("Hello, human!")
      console.log(my.ping.ping());
    });

    after((5).seconds(), function(){
      console.log("I've been at your command for 5 seconds now.")
    });
  }
});

Cylon.start();
