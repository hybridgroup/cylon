###
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require('./cylon')
EventEmitter = require('events').EventEmitter

module.exports = class Device extends EventEmitter
  klass = this

  constructor: (opts = {}) ->
    @self = this
    @robot = opts.robot
    @name = opts.name
    @pin = opts.pin
    @connection = @determineConnection(opts.connection) or @defaultConnection()
    @driver = @requireDriver(opts)
    proxyFunctionsToObject @driver.commands(), @driver, klass

  start: (callback) =>
    msg = "Starting device '#{ @name }'"
    msg += " on pin #{@pin}" if @pin?
    Logger.info msg
    @driver.start(callback)

  data: ->
    {
      name: @name
      driver: @driver.constructor.name || @driver.name
      pin: if @pin? then @pin.toString else null
      connection: @connection.data()
      commands: @driver.commands()
    }

  determineConnection: (c) ->
    @robot.connections[c] if c

  defaultConnection: ->
    first = 0
    for k, v of @robot.connections
      first or= v
    first

  requireDriver: (opts = {}) ->
    Logger.debug "Loading driver '#{ opts.driver }'"
    @robot.requireDriver(opts.driver, @self, opts)
