###
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

Connection = require("./connection")
Device = require("./device")

module.exports = class Robot
  self = this
  @connectionTypes = {}
  @deviceTypes = {}

  constructor: (opts = {}) ->
    @name = opts.name or @constructor.randomName()
    @master = opts.master
    @connections = initConnections(opts.connection or opts.connections or {})
    @devices = initDevices(opts.device or opts.devices or {})
    @work = opts.work or -> (console.log "No work yet")

  @randomName: ->
    "Robot #{ Math.floor(Math.random() * 100000) }"

  initConnections = (connections) ->
    console.log "Initializing connections..."
    # make sure we're dealing with an Array
    connections = [].concat connections
    for connection in connections
      console.log "Initializing connection '#{ connection.name }'..."
      self.connectionTypes[connection.name] = new Connection(connection)

  initDevices = (devices) ->
    console.log "Initializing devices..."
    # make sure we're dealing with an Array
    devices = [].concat devices
    for device in devices
      console.log "Initializing device '#{ device.name }'..."
      self.deviceTypes[device.name] = new Device(device)

  start: ->
    @startConnections()
    @startDevices()
    (@work)()

  startConnections: ->
    console.log "Starting connections..."
    for n, connection of self.connectionTypes
      console.log "Starting connection '#{ connection.name }'..."
      connection.connect()
      self[connection.name] = connection

  startDevices: ->
    console.log "Starting devices..."
    for n, device of self.deviceTypes
      console.log "Starting device '#{ device.name }'..."
      device.start()
      self[device.name] = device
