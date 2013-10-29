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
EventEmitter = require('events').EventEmitter

module.exports = class Connection extends EventEmitter
  klass = this

  constructor: (opts = {}) ->
    @self = this
    @robot = opts.robot
    @name = opts.name
    @adaptor = @requireAdaptor(opts.adaptor) # or 'loopback')
    @port = new Port(opts.port)
    proxyFunctionsToObject @adaptor.commands(), @adaptor, klass

  connect: (callback) ->
    Logger.info "Connecting to '#{@name}' on port '#{@port.toString()}'..."
    @adaptor.connect(callback)

  disconnect: ->
    Logger.info "Disconnecting from '#{@name}' on port '#{@port.toString()}'..."
    @adaptor.disconnect()

  requireAdaptor: (adaptorName) ->
    Logger.debug "Loading adaptor '#{adaptorName}'"
    @robot.requireAdaptor(adaptorName, @self)
