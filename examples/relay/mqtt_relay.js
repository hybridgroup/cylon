var Cylon = require("cylon");

Cylon.robot({
  connections: {
    arduino: { adaptor: "firmata",
               port: '/dev/ttyACM0' },
    mqtt: { adaptor: 'mqtt', host: 'mqtt://localhost:1883' }
  },

  devices: {
    toggle: { driver: "mqtt", topic: "toggle", connection: "mqtt" },
    relay: { driver: 'relay', pin: 2, type: "closed" }
  },

  work: function(my) {
    my.toggle.on("message", function(data) {
      console.log("Message on 'toggle': " + data);
      my.relay.toggle();
    });

    every((1).second(), function() {
      console.log("Toggling Relay.");
      my.toggle.publish("toggle");
    });
  }
}).start();
