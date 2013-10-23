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
    console.log "started"
    
  determineConnection: (c) ->
    @robot.connections[c] if c

  defaultConnection: ->
    @robot.connections.first

  requireDriver: (driverName) ->
    console.log "dynamic load driver"
    #new require("cylon-#{driverName}")(device: self)
