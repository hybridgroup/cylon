###
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require("./robot")
Port = require("./port")

module.exports = class Connection
  self = this

  constructor: (opts = {}) ->
    @robot = opts.robot
    @name = opts.name
    @adaptor = @requireAdaptor(opts.adaptor) # or 'loopback')
    @port = new Port(opts.port)

  connect: ->
    Logger.info "Connecting to '#{@name}' on port '#{@port.toString()}'..."
    @adaptor.connect(this)

  disconnect: ->
    Logger.info "Disconnecting from '#{@name}' on port '#{@port.toString()}'..."
    @adaptor.disconnect(this)

  requireAdaptor: (adaptorName) ->
    Logger.info "dynamic load adaptor"
    @robot.requireAdaptor(adaptorName, this)
