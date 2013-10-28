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
  constructor: (opts = {}) ->
    @self = this
    @robot = opts.robot
    @name = opts.name
    @pin = opts.pin
    @connection = @determineConnection(opts.connection) or @defaultConnection()
    @driver = @requireDriver(opts.driver)
    proxyFunctionsToObject @driver.commands(), @driver, this

  start: (callback) ->
    msg = "Starting device '#{ @name }'"
    msg += " on pin #{@pin}" if @pin?
    Logger.info msg
    @driver.start(callback)

  determineConnection: (c) ->
    @robot.connections[c] if c

  defaultConnection: ->
    first = 0
    for k, v of @robot.connections
      first or= v
    first

  requireDriver: (driverName) ->
    Logger.debug "Loading driver '#{driverName}'"
    @robot.requireDriver(driverName, @self)
