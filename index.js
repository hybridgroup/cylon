"use strict";

var MCP = require("./lib/mcp");

module.exports = {
  MCP: require("./lib/mcp"),

  Robot: require("./lib/robot"),

  Driver: require("./lib/driver"),
  Adaptor: require("./lib/adaptor"),

  Utils: require("./lib/utils"),
  Logger: require("./lib/logger"),

  IO: {
    DigitalPin: require("./lib/io/digital-pin"),
    Utils: require("./lib/io/utils")
  },

  robot: MCP.create,
  api: require("./lib/api").create,
  config: require("./lib/config").update,

  start: MCP.start,
  halt: MCP.halt
};

process.on("SIGINT", function() {
  MCP.halt(process.kill.bind(process, process.pid));
});

if (process.platform === "win32") {
  var io = { input: process.stdin, output: process.stdout },
      quit = process.emit.bind(process, "SIGINT");

  require("readline").createInterface(io).on("SIGINT", quit);
}
