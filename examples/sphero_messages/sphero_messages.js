var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' },
  device: { name: 'sphero', driver: 'sphero' },

  work: function(me) {
    me.sphero.on('connect', function() {
      Logger.info("Setting up Collision Detection...");
      me.sphero.detectCollisions();
      me.sphero.setRGB(0x00FF00);
    });

    me.sphero.on('update', function(data) {
      Logger.info("Update event eventName: " + data + " ");
      Logger.info("Update event args: ");
      Logger.info(data);
    });

    me.sphero.on('message', function(data) {
      me.sphero.setRGB(0x0000FF);
      Logger.info("Message:");
      Logger.info(data);
    });

    me.sphero.on('collision', function(data) {
      me.sphero.setRGB(0xFF0000);
      Logger.info("Collision:");
      Logger.info(data);
    });

    me.sphero.on('notification', function(data) {
      me.sphero.setRGB(0xFF0000);
      Logger.info("Notification:");
      Logger.info(data);
    });
  }
}).start();
