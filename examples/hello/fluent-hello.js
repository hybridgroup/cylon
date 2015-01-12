"use strict";

var Cylon = require("../..");

// ensure you install the API plugin first:
// $ npm install cylon-api-http
Cylon.api();

Cylon
  .robot({ name: "test" })
  .connection("loopback", { adaptor: "loopback" })
  .device("ping", { driver: "ping" })
  .on("ready", function(bot) {
    setInterval(function() {
      console.log("Hello, human!");
      console.log(bot.ping.ping());
    }, 1000);

    setTimeout(function() {
      console.log("I've been at your command for 5 seconds now.");
    }, 5000);
  });

Cylon.start();
