"use strict";

function lib(path) { return require("./lib/" + path); }

var Config = lib("config"),
    MCP = lib("mcp"),
    API = lib("api");

var exports = module.exports = {};

exports.MCP = lib("mcp");
exports.Robot = lib("robot");
exports.Driver = lib("driver");
exports.Adaptor = lib("adaptor");

exports.Utils = lib("utils");
exports.Logger = lib("logger");

exports.IO = {
  DigitalPin: lib("io/digital-pin"),
  Utils: lib("io/utils")
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
