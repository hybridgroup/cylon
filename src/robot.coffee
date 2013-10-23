###
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require('./cylon')
Connection = require("./connection")
Device = require("./device")

module.exports = class Robot
  self = this
  @adaptors = {}
  @drivers = {}

  constructor: (opts = {}) ->
    @name = opts.name or @constructor.randomName()
    @master = opts.master
    @connections = {}
    @devices = {}

    @registerAdaptor "./loopback", "loopback"

    @initConnections(opts.connection or opts.connections)
    @initDevices(opts.device or opts.devices)
    @work = opts.work or -> (Logger.info "No work yet")

  @randomName: ->
    "Robot #{ Math.floor(Math.random() * 100000) }"

  initConnections: (connections) =>
    Logger.info "Initializing connections..."
    return unless connections?
    connections = [].concat connections
    for connection in connections
      Logger.info "Initializing connection '#{ connection.name }'..."
      connection['robot'] = this
      @connections[connection.name] = new Connection(connection)

  initDevices: (devices) =>
    Logger.info "Initializing devices..."
    return unless devices?
    devices = [].concat devices
    for device in devices
      Logger.info "Initializing device '#{ device.name }'..."
      device['robot'] = this
      @devices[device.name] = new Device(device)

  start: ->
    @startConnections()
    @startDevices()
    @work.call(self, self)

  startConnections: =>
    Logger.info "Starting connections..."
    for n, connection of @connections
      Logger.info "Starting connection '#{ connection.name }'..."
      connection.connect()
      this[connection.name] = connection

  startDevices: =>
    Logger.info "Starting devices..."
    for n, device of @devices
      Logger.info "Starting device '#{ device.name }'..."
      device.start()
      this[device.name] = device

  @requireAdaptor = (adaptorName, connection) =>
    if @adaptors[adaptorName]?
      if typeof @adaptors[adaptorName] is 'string'
        @adaptors[adaptorName] = require(@adaptors[adaptorName]).adaptor(name: adaptorName, connection: connection)
    else
      require("cylon-#{adaptorName}").register(this)
      @adaptors[adaptorName] = require("cylon-#{adaptorName}").adaptor(name: adaptorName, connection: connection)

    return @adaptors[adaptorName]

  requireAdaptor: (args...) ->
    self.requireAdaptor(args...)

  @registerAdaptor: (moduleName, adaptorName) ->
    return if self.adaptors[adaptorName]?
    self.adaptors[adaptorName] = moduleName

  registerAdaptor: (args...) ->
    self.registerAdaptor(args...)

  requireDriver: (driverName, device) =>
    if @drivers[driverName]?
      if typeof @drivers[driverName] is 'string'
        @drivers[driverName] = require(@drivers[driverName]).driver(driver: driver)
    else
      require("cylon-#{driverName}").register(this)
      @drivers[driverName] = require("cylon-#{driverName}").driver(driver: driver)

    return @drivers[driverName]

  @requireDriver = (args...) ->
    self.requireDriver(args...)

  @registerDriver: (moduleName, driverName) =>
    return if self.drivers[driverName]?
    self.drivers[driverName] = moduleName

  registerDriver: (args...) ->
    self.registerDriver(args...)
