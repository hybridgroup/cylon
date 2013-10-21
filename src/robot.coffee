###
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

Connection = source("connection")
Device = source("device")

module.exports = class Robot
  @connectionTypes = {}
  @deviceTypes = {}

  constructor: (opts = {}) ->
    @name = opts.name or @constructor.randomName()
    @connections = initConnections(opts.connection or opts.connections or {})
    @devices = initDevices(opts.device or opts.devices or {})
    @work = opts.work or -> (console.log "No work yet")

  @randomName: ->
    "Robot #{ Math.floor(Math.random() * 100000) }"

  initConnections = (connections) ->
    console.log "Initializing connections..."
    for connection in connections
      console.log "Initializing connection '#{ connection.name }'..."
      @connectionTypes[connection.name] = new Connection(connection)

  initDevices = (devices) ->
    console.log "Initializing devices..."
    for device in devices
      console.log "Initializing device '#{ device.name }'..."
      @deviceTypes[device.name] = new Device(device)

  start: ->
    @startConnections()
    @startDevices()
    (@work)()

  startConnections: ->
    console.log "Starting connections..."
    for n, connection of @connectionTypes
      console.log "Starting connection '#{ connection.name }'..."
      connection.connect()

  startDevices: ->
    console.log "Starting devices..."
    for n, device of @deviceTypes
      console.log "Starting device '#{ device.name }'..."
      device.start()
