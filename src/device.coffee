###
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

module.exports = class Device
  constructor: (opts = {}) ->
    @parent = opts.parent
    @name = opts.name
    @connection = @determineConnection(opts.connection) or @defaultConnection
    @driver = @requireDriver(opts.driver)

  start: ->
    console.log "started"
    
  determineConnection: (c) ->
    @parent.connections(c) if c

  defaultConnection: ->
    @parent.connections.first

  requireDriver: (driverName) ->
    console.log "dynamic load driver"
