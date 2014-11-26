var Cylon = require('../..');

var arduinos = [
  {
    name: "arduino0",
    port: "/dev/ttyACM0",
    devices: {
      led00: { driver: 'led', pin: 13 }
    }
  },

  {
    name: "arduin01",
    port: "/dev/ttyACM1",
    devices: {
      led10: { driver: 'led', pin: 11 }
      led11: { driver: 'led', pin: 12 }
      led12: { driver: 'led', pin: 13 }
    }
  }
];

Cylon.robot({
  name: "SkynetBot",

  connections: {
    skynet: {
      adaptor: 'skynet',
      uuid: "96630051-a3dc-11e3-8442-5bf31d98c912",
      token: "2s67o7ek98pycik98f43reqr90t6s9k9"
    }
  },

  handler: function(data) {
    if (data.payload == null) {
      return;
    }

    console.log("Data: ", data);

    for (var i in data.payload.robots) {
      var robot = data.payload.robots[i],
          bot = Cylon.robots[robot.name];

      if (robot.cmd === 'on') {
        bot.devices[robot.device].turnOn();
      } else {
        bot.devices[robot.device].turnOff();
      }
    }
  },

  work: function(my) {
    my.skynet.on('message', my.handler)
    console.log("Skynet is listening");
  }
});

arduinos.forEach(function(bot) {
  Cylon.robot({
    name: bot.name,

    connections: {
      arduino: { adaptor: 'firmata', port: bot.port }
    },

    devices: bot.devices,

    work: function(my) {
      console.log(my.name + " is online");
    }
  });
});

Cylon.start();
