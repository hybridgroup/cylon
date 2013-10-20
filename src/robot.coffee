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
    @_connections = {}
    @_devices = {}
    @name = opts.name
    @connections = initConnections(opts.connection or opts.connections or {})
    @devices = initDevices(opts.device or opts.devices or {})
    @work = opts.work or -> (console.log "No work yet")

  initConnections = (connections) ->
    console.log "Initializing connections..."
    initConnection connection for connection in connections

  initConnection = (connection) ->
    console.log "Initializing connection '#{ connection.name }'..."
    @_connections[connection.name] = new Connection(connection)

  initDevices = (devices) ->
    console.log "Initializing devices..."
    initDevice device for device in devices

  initDevice = (device) ->
    console.log "Initializing device '#{ device.name }'..."
    @_devices[device.name] = new Device(device)

  start: ->
    startConnections()
    startDevices()
    (@work)

  startConnections = ->
    console.log "Starting connections..."

  startDevices = ->
    console.log "Starting devices..."
