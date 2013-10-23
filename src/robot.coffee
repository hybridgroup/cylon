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

  constructor: (opts = {}) ->
    @name = opts.name or @constructor.randomName()
    @master = opts.master
    @connections = {}
    @devices = {}

    initConnections(opts.connection or opts.connections)
    initDevices(opts.device or opts.devices)
    @work = opts.work or -> (console.log "No work yet")

  @randomName: ->
    "Robot #{ Math.floor(Math.random() * 100000) }"

  initConnections = (connections) ->
    console.log "Initializing connections..."
    return unless connections?
    connections = [].concat connections
    for connection in connections
      console.log "Initializing connection '#{ connection.name }'..."
      connection['robot'] = self
      self.connections[connection.name] = new Connection(connection)

  initDevices = (devices) ->
    console.log "Initializing devices..."
    return unless devices?
    devices = [].concat devices
    for device in devices
      console.log "Initializing device '#{ device.name }'..."
      device['robot'] = self
      self.devices[device.name] = new Device(device)

  start: ->
    @startConnections()
    @startDevices()
    @work.call(self, self)

  startConnections: ->
    console.log "Starting connections..."
    for n, connection of self.connections
      console.log "Starting connection '#{ connection.name }'..."
      connection.connect()
      self[connection.name] = connection

  startDevices: ->
    console.log "Starting devices..."
    for n, device of self.devices
      console.log "Starting device '#{ device.name }'..."
      device.start()
      self[device.name] = device

  requireDriver: (driverName, device) ->
    console.log "load the driver"
    #new require("cylon-#{driverName}")(device: device)
