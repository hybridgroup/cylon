###
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

module.exports = class Device
  self = this

  constructor: (opts = {}) ->
    @robot = opts.robot
    @name = opts.name
    @connection = @determineConnection(opts.connection) or @defaultConnection
    @driver = @requireDriver(opts.driver)

  start: ->
    Logger.info "started"

  determineConnection: (c) ->
    @robot.connections[c] if c

  defaultConnection: ->
    @robot.connections.first

  requireDriver: (driverName) ->
    Logger.info "dynamic load driver"
    #new require("cylon-#{driverName}")(device: self)
