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
    @connection = @determineConnection(opts.connection) or @defaultConnection()
    @driver = @requireDriver(opts.driver)
    @addCommands(@driver)

  start: ->
    Logger.info "started"

  determineConnection: (c) ->
    @robot.connections[c] if c

  defaultConnection: ->
    first = 0
    for k, v of @robot.connections
      first or= v
    first

  requireDriver: (driverName) ->
    Logger.info "dynamic load driver"
    @self.emit('driver_load')
    @robot.requireDriver(driverName, @self)

  addCommands: (object) ->
    @addProxy(object, method) for method in object.commands()

  addProxy: (object, method) ->
    @self[method] = (args...) -> object[method](args...)
