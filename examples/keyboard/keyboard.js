var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'keyboard', adaptor: 'keyboard' },
  device: {name: 'keyboard', driver: 'keyboard'},

  work: function(my) {
    my.keyboard.on('a', function(key) { 
      console.log("A PRESSED!");
    });
  }
}).start();