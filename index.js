"use strict";

var Config = require("./lib/config"),
    MCP = require("./lib/mcp"),
    API = require("./lib/api");

var exports = module.exports = {};

exports.MCP = require("./lib/mcp");
exports.Robot = require("./lib/robot");
exports.Driver = require("./lib/driver");
exports.Adaptor = require("./lib/adaptor");

exports.Utils = require("./lib/utils");
exports.Logger = require("./lib/logger");

exports.IO = {
  DigitalPin: require("./lib/io/digital-pin"),
  Utils: require("./lib/io/utils")
};

exports.robot = MCP.create;
exports.start = MCP.start;
exports.halt = MCP.halt;

exports.api = API.create;

exports.config = Config.update;

process.on("SIGINT", function() {
  exports.halt(function() {
    process.kill(process.pid);
  });
});

if (process.platform === "win32") {
  var io = { input: process.stdin, output: process.stdout },
      quit = process.emit.bind(process, "SIGINT");

  require("readline").createInterface(io).on("SIGINT", quit);
}
