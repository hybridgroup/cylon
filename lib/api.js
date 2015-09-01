"use strict";

var MCP = require("./mcp"),
    Logger = require("./logger"),
    _ = require("./utils/helpers");

var api = module.exports = {};

api.instances = [];

/**
 * Creates a new API instance
 *
 * @param {String} [Server] which API plugin to use (e.g. "http" loads
 * cylon-api-http)
 * @param {Object} opts options for the new API instance
 * @return {void}
 */
api.create = function create(Server, opts) {
  // if only passed options (or nothing), assume HTTP server
  if (Server == null || _.isObject(Server) && !_.isFunction(Server)) {
    opts = Server;
    Server = "http";
  }

  opts = opts || {};

  if (_.isString(Server)) {
    var req = "cylon-api-" + Server;

    try {
      Server = require(req);
    } catch (e) {
      if (e.code !== "MODULE_NOT_FOUND") {
        throw e;
      }

      [
        "Cannot find the " + req + " API module.",
        "You may be able to install it: `npm install " + req + "`"
      ].forEach(Logger.log);

      throw new Error("Missing API plugin - cannot proceed");
    }
  }

  opts.mcp = MCP;

  var instance = new Server(opts);
  api.instances.push(instance);
  instance.start();
};
