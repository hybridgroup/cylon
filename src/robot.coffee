###
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require './cylon'
require './basestar'
require './digital-pin'

namespace = require 'node-namespace'

require "./connection"
require "./device"
Async = require "async"

# A Robot is the primary interface for interacting with a collection of physical
# computing capabilities.
namespace 'Cylon', ->
  class @Robot
    klass = this

    # Public: Creates a new Robot
    #
    # opts - object containing Robot options
    #   name - optional, string name of the robot
    #   master - Cylon.Master class that orchestrates robots
    #   connection/connections - object connections to connect to
    #   device/devices - object devices to connect to
    #   work - work to be performed when the Robot is started
    #
    # Returns a new Robot
    # Example (CoffeeScript):
    #    Cylon.robot
    #      name: "Spherobot!"
    #
    #      connection:
    #        name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'
    #
    #      device:
    #        name: 'sphero', driver: 'sphero'
    #
    #      work: (me) ->
    #        every 1.second(), ->
    #          me.sphero.roll 60, Math.floor(Math.random() * 360)
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

      for n, func of opts
        reserved = ['connection', 'connections', 'device', 'devices', 'work']
        @robot[n] = func unless n in reserved

    # Public: Generates a random name for a Robot.
    #
    # Returns a string name
    @randomName: ->
      "Robot #{ Math.floor(Math.random() * 100000) }"

    # Public: Exports basic data for the Robot
    #
    # Returns an Object containing Robot data
    data: ->
      {
        name: @name
        connections: (connection.data() for n, connection of @connections)
        devices: (device.data() for n, device of @devices)
      }

    # Public: Initializes all connections for the robot
    #
    # connections - connections to initialize
    #
    # Returns initialized connections
    initConnections: (connections) =>
      Logger.info "Initializing connections..."
      return unless connections?
      connections = [].concat connections
      for connection in connections
        Logger.info "Initializing connection '#{ connection.name }'..."
        connection['robot'] = this
        @connections[connection.name] = new Cylon.Connection(connection)

      @connections

    # Public: Initializes all devices for the robot
    #
    # devices - devices to initialize
    #
    # Returns initialized devices
    initDevices: (devices) =>
      Logger.info "Initializing devices..."
      return unless devices?
      devices = [].concat devices
      for device in devices
        Logger.info "Initializing device '#{ device.name }'..."
        device['robot'] = this
        @devices[device.name] = new Cylon.Device(device)

    # Public: Starts the Robot working.
    #
    # Starts the connections, devices, and work.
    #
    # Returns the result of the work
    start: =>
      @startConnections =>
        @robot.startDevices =>
          @robot.work.call(@robot, @robot)

    # Public: Starts the Robot's connections and triggers a callback
    #
    # callback - callback function to be triggered
    #
    # Returns nothing
    startConnections: (callback) =>
      Logger.info "Starting connections..."
      starters = {}
      for n, connection of @connections
        starters[n] = connection.connect

      Async.parallel starters, callback

    # Public: Starts the Robot's devices and triggers a callback
    #
    # callback - callback function to be triggered
    #
    # Returns nothing
    startDevices: (callback) =>
      Logger.info "Starting devices..."
      starters = {}
      for n, device of @devices
        @robot[n] = device
        starters[n] = device.start

      Async.parallel starters, callback

    # Public: Stops the Robot working.
    #
    # Stops the devices, disconnects the connections.
    #
    # Returns nothing
    stop: =>
      for n, device of @devices
        device.stop()

      for n, connection of @connections
        connection.disconnect()

    # Public: Requires a hardware adaptor and adds it to @robot.adaptors
    #
    # adaptorName - module name of adaptor to require
    # connection - the Connection that requested the adaptor be required
    #
    # Returns the set-up adaptor
    requireAdaptor: (adaptorName, connection, opts = {}) ->
      if @robot.adaptors[adaptorName]?
        if typeof @robot.adaptors[adaptorName] is 'string'
          @robot.adaptors[adaptorName] = require(@robot.adaptors[adaptorName]).adaptor(name: adaptorName, connection: connection, extraParams: opts)
      else
        require("cylon-#{adaptorName}").register(this)
        @robot.adaptors[adaptorName] = require("cylon-#{adaptorName}").adaptor(name: adaptorName, connection: connection, extraParams: opts)

      return @robot.adaptors[adaptorName]

    # Public: Registers an Adaptor with the Robot
    #
    # moduleName - name of the Node module to require
    # adaptorName - name of the adaptor to register the moduleName under
    #
    # Returns the registered module name
    registerAdaptor: (moduleName, adaptorName) ->
      return if @adaptors[adaptorName]?
      @adaptors[adaptorName] = moduleName

    # Public: Requires a hardware driver and adds it to @robot.drivers
    #
    # driverName - module name of driver to require
    # connection - the Connection that requested the driver be required
    #
    # Returns the set-up driver
    requireDriver: (driverName, device, opts = {}) ->
      if @robot.drivers[driverName]?
        if typeof @robot.drivers[driverName] is 'string'
          @robot.drivers[driverName] = require(@robot.drivers[driverName]).driver(name: driverName, device: device, extraParams: opts)
      else
        require("cylon-#{driverName}").register(this)
        @robot.drivers[driverName] = require("cylon-#{driverName}").driver(name: driverName, device: device, extraParams: opts)

      return @robot.drivers[driverName]

    # Public: Registers an Driver with the Robot
    #
    # moduleName - name of the Node module to require
    # driverName - name of the driver to register the moduleName under
    #
    # Returns the registered module name
    registerDriver: (moduleName, driverName) =>
      return if @drivers[driverName]?
      @drivers[driverName] = moduleName

module.exports = Cylon.Robot
