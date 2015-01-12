"use strict";

var Cylon = require("../..");

// ensure you install the API plugin first:
// $ npm install cylon-api-http
Cylon.api();

Cylon.robot({
  name: "test",

  connections: {
    loopback: { adaptor: "loopback" }
  },

  devices: {
    ping: { driver: "ping" }
  },

  work: function(my) {
    every((1).seconds(), function(){
      console.log("Hello, human!");
      console.log(my.ping.ping());
    });

    after((5).seconds(), function(){
      console.log("I've been at your command for 5 seconds now.");
    });
  }
});

Cylon.start();
