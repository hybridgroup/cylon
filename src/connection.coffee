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

  constructor: (opts = {}) ->
    @self = this
    @robot = opts.robot
    @name = opts.name
    @adaptor = @requireAdaptor(opts.adaptor) # or 'loopback')
    @addCommands(@adaptor)
    @port = new Port(opts.port)

  connect: ->
    Logger.info "Connecting to '#{@name}' on port '#{@port.toString()}'..."
    @self.emit('connected')
    @adaptor.connect(@self)

  disconnect: ->
    Logger.info "Disconnecting from '#{@name}' on port '#{@port.toString()}'..."
    @adaptor.disconnect(@self)

  requireAdaptor: (adaptorName) ->
    Logger.info "dynamic load adaptor"
    @robot.requireAdaptor(adaptorName, @self)

  addCommands: (object) ->
    @addProxy(object, method) for method in object.commands()

  addProxy: (object, method) ->
    this[method] = (args...) -> object[method](args...)
