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
Async = require("async")

module.exports = class Robot
  self = this

  constructor: (opts = {}) ->
    @robot = this
    @name = opts.name or @constructor.randomName()
    @master = opts.master
    @connections = {}
    @devices = {}
    @adaptors = {}
    @drivers = {}

    @registerAdaptor "./loopback", "loopback"
    @registerDriver "./ping", "ping"

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

  start: =>
    @startConnections =>
      @robot.startDevices =>
        @robot.work.call(@robot, @robot)

  startConnections: (cb) =>
    Logger.info "Starting connections..."
    c = {}
    for n, connection of @connections
      c[connection.name] = (callback) ->
        Logger.info "Starting connection '#{ connection.name }'..."
        connection.connect(callback)

    Async.parallel c, cb

  startDevices: (cb) =>
    Logger.info "Starting devices..."
    d = {}
    for n, device of @devices
      this[device.name] = device
      d[device.name] = (callback) ->
        Logger.info "Starting device '#{ device.name }'..."
        device.start(callback)
    
    Async.parallel d, cb

  requireAdaptor: (adaptorName, connection) ->
    if @robot.adaptors[adaptorName]?
      if typeof @robot.adaptors[adaptorName] is 'string'
        @robot.adaptors[adaptorName] = require(@robot.adaptors[adaptorName]).adaptor(name: adaptorName, connection: connection)
    else
      require("cylon-#{adaptorName}").register(this)
      @robot.adaptors[adaptorName] = require("cylon-#{adaptorName}").adaptor(name: adaptorName, connection: connection)

    return @robot.adaptors[adaptorName]

  registerAdaptor: (moduleName, adaptorName) ->
    return if @adaptors[adaptorName]?
    @adaptors[adaptorName] = moduleName

  requireDriver: (driverName, device) ->
    if @robot.drivers[driverName]?
      if typeof @robot.drivers[driverName] is 'string'
        @robot.drivers[driverName] = require(@robot.drivers[driverName]).driver(device: device)
    else
      require("cylon-#{driverName}").register(this)
      @robot.drivers[driverName] = require("cylon-#{driverName}").driver(device: device)

    return @robot.drivers[driverName]

  registerDriver: (moduleName, driverName) =>
    return if @drivers[driverName]?
    @drivers[driverName] = moduleName
