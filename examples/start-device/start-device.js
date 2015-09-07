"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    loopback: { adaptor: "loopback" }
  },

  connectPinger: function() {
    this.device("pinger",
                {connection: "loopback", driver: "ping"});
    this.startDevice(this.devices.pinger, function() {
      console.log("Get ready to ping...");
    });
  },

  work: function(my) {
    my.connectPinger();

    every((1).second(), function() {
      console.log(my.pinger.ping());
    });
  }
}).start();
