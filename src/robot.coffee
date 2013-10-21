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
  constructor: (opts = {}) ->
    @connectionTypes = {}
    @deviceTypes = {}
    @name = opts.name or @constructor.randomName()
    @connections = initConnections(opts.connection or opts.connections or {})
    @devices = initDevices(opts.device or opts.devices or {})
    @work = opts.work or -> (console.log "No work yet")

  start: ->
    @startConnections()
    @startDevices()
    (@work)()

  initConnections = (connections) ->
    console.log "Initializing connections..."
    initConnection connection for connection in connections

  initConnection = (connection) ->
    console.log "Initializing connection '#{ connection.name }'..."
    @connectionTypes[connection.name] = new Connection(connection)

  initDevices = (devices) ->
    console.log "Initializing devices..."
    initDevice device for device in devices

  initDevice = (device) ->
    console.log "Initializing device '#{ device.name }'..."
    @deviceTypes[device.name] = new Device(device)

  startConnections: ->
    console.log "Starting connections..."
    startConnection connection for n, connection of @connectionTypes

  startConnection: (connection) ->
    console.log "Starting connection '#{ connection.name }'..."
    connection.connect()

  startDevices: ->
    console.log "Starting devices..."
    startDevice device for n, device of @deviceTypes

  startDevice: (device) ->
    console.log "Starting device '#{ device.name }'..."
    device.start()

  @randomName: ->
    "Robot #{ Math.floor(Math.random() * 100000) }"
