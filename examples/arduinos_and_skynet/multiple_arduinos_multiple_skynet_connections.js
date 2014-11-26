var Cylon = require("../..");

var bots = [
  {
    port: "/dev/ttyACM0",
    uuid: "96630051-a3dc-11e3-8442-5bf31d98c912",
    token: "2s67o7ek98pycik98f43reqr90t6s9k9"
  },

  {
    port: "/dev/ttyACM1",
    uuid: "e8f942f1-a49c-11e3-9270-795e22e700d8",
    token: "0lpxpyafz7z7u8frgvp44g8mbr7o80k9"
  },
];

bots.forEach(function(bot) {
  Cylon.robot({
    connections: {
      arduino: { adaptor: "firmata", port: bot.port },
      skynet: { adaptor: "skynet", uuid: bot.uuid, token: bot.port }
    },

    devices: {
      led13: { driver: "led", pin: 13, connection: "arduino" }
    },

    work: function(my) {
      my.skynet.on('message', function(data) {
        if (data.led13 === 'on') {
          my.led13.turnOn();
        } else if (data.led13 === 'off') {
          my.led13.turnOff();
        }

        console.log("Skynet instance on '" + my.name + "' is listening");
      });
    }
  });
});

Cylon.start();
