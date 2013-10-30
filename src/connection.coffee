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
    opts.id ?= Math.floor(Math.random() * 10000)
    @self = this
    @robot = opts.robot
    @name = opts.name
    @connection_id = opts.id
    @adaptor = @requireAdaptor(opts.adaptor) # or 'loopback')
    @port = new Port(opts.port)
    proxyFunctionsToObject @adaptor.commands(), @adaptor, klass

  data: ->
    {
      name: @name,
      port: @port.toString()
      adaptor: @adaptor.constructor.name || @adaptor.name
      connection_id: @connection_id
    }

  connect: (callback) =>
    msg = "Connecting to '#{@name}'"
    msg += " on port '#{@port.toString()}'" if @port?
    Logger.info msg
    @adaptor.connect(callback)

  disconnect: ->
    msg = "Disconnecting from '#{@name}'"
    msg += " on port '#{@port.toString()}'" if @port?
    Logger.info msg
    @adaptor.disconnect()

  requireAdaptor: (adaptorName) ->
    Logger.debug "Loading adaptor '#{adaptorName}'"
    @robot.requireAdaptor(adaptorName, @self)
