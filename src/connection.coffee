###
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

Port = require("./port")

module.exports = class Connection
  constructor: (opts = {}) ->
    @robot = opts.robot
    @name = opts.name
    @adaptor = opts.adaptor
    @port = new Port(opts.port)

  connect: ->
    console.log "Connecting to '#{@name}' on port '#{@port.toString()}'..."

  disconnect: ->
    console.log "Disconnecting from '#{@name}' on port '#{@port.toString()}'..."
