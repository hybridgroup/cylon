var Cylon = require('../..');

Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' },

    skynet: {
      adaptor: 'skynet',
      uuid: "96630051-a3dc-11e3-8442-5bf31d98c912",
      token: "2s67o7ek98pycik98f43reqr90t6s9k9"
    }
  },

  devices: {
    led13: { driver: 'led', pin: 13, connection: 'arduino' }
  },

  work: function(my) {
    console.log("Skynet is listening");

    my.skynet.on('message', function(data) {
      data = JSON.parse(data);

      console.log(data);

      if (data.message.red === 'on') {
        my.led13.turnOn();
      } else {
        my.led13.turnOff();
      }
    });

  }
}).start();
