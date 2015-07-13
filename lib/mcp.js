"use strict";

var EventEmitter = require("events").EventEmitter;

var Config = require("./config"),
    Logger = require("./logger"),
    Utils = require("./utils"),
    Robot = require("./robot"),
    _ = require("./utils/helpers");

var mcp = module.exports = new EventEmitter();

mcp.robots = {};
mcp.commands = {};
mcp.events = [ "robot_added", "robot_removed" ];

/**
 * Creates a new Robot with the provided options.
 *
 * @param {Object} opts robot options
 * @return {Robot} the new robot
 */
mcp.create = function create(opts) {
  opts = opts || {};

  // check if a robot with the same name exists already
  if (opts.name && mcp.robots[opts.name]) {
    var original = opts.name;
    opts.name = Utils.makeUnique(original, Object.keys(mcp.robots));

    var str = "Robot names must be unique. Renaming '";
    str += original + "' to '" + opts.name + "'";

    Logger.log(str);
  }

  var bot = new Robot(opts);
  mcp.robots[bot.name] = bot;
  mcp.emit("robot_added", bot.name);

  return bot;
};

mcp.start = function start(callback) {
  var fns = _.pluck(mcp.robots, "start");

  _.parallel(fns, function() {
    var mode = Utils.fetch(Config, "workMode", "async");
    if (mode === "sync") { _.invoke(mcp.robots, "startWork"); }
    callback();
  });
};

/**
 * Halts all MCP robots.
 *
 * @param {Function} callback function to call when done halting robots
 * @return {void}
 */
mcp.halt = function halt(callback) {
  callback = callback || function() {};

  var timeout = setTimeout(callback, Config.haltTimeout || 3000);

  _.parallel(_.pluck(mcp.robots, "halt"), function() {
    clearTimeout(timeout);
    callback();
  });
};

/**
 * Serializes MCP robots, commands, and events into a JSON-serializable Object.
 *
 * @return {Object} a serializable representation of the MCP
 */
mcp.toJSON = function() {
  return {
    robots: _.invoke(mcp.robots, "toJSON"),
    commands: Object.keys(mcp.commands),
    events: mcp.events
  };
};
