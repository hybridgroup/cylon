###
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

Connection = source("connection")

module.exports = class Robot
  constructor: (opts) ->
    @name = opts.name
    @connections = initConnections(opts.connection or opts.connections or {})
    @devices = initDevices(opts.device or opts.devices)
    @work = opts.work or -> (console.log "No work yet")

  initConnections = (connections) ->
    console.log "Initialing connections..."
    initConnection connection for connection in connections

  initConnection = (connection) ->
    console.log "Initialing connection '" + connection.name + "'..."
    @_connections[connection.name] = new Connection(connection)

  initDevices = (devices) ->
    console.log "Initialing devices..."

  start: ->
    startConnections()
    startDevices()
    (@work)

  startConnections = ->
    console.log "Starting connections..."

  startDevices = ->
    console.log "Starting devices..."
