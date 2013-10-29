###
 * api
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

restify = require 'restify'
socketio = require 'socket.io'
namespace = require 'node-namespace'

namespace "Cylon.API", ->
  # The Cylon API Server provides an interface to communicate with master class
  # and retrieve information about the robots being controlled.
  class @Server
    constructor: (opts = {}) ->
      host = opts.host || "127.0.0.1"
      port = opts.port || "3000"

      @self = this
      @server = restify.createServer(name: "Cylon API Server")
      @io = socketio.listen server

    master: -> Cylon.getInstance()
