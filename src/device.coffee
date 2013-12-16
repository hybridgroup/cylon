###
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

require './cylon'
require './driver'

namespace = require 'node-namespace'
EventEmitter = require('events').EventEmitter

# The Artoo::Device class represents the interface to
# a specific individual hardware devices. Examples would be a digital
# thermometer connected to an Arduino, or a Sphero's accelerometer.
namespace 'Cylon', ->
  class @Device extends EventEmitter

    # Public: Creates a new Device
    #
    # opts - object containing Device params
    #   name - string name of the device
    #   pin - string pin of the device
    #   robot - parent Robot to the device
    #   connection - connection to the device
    #   driver - string name of the module the device driver logic lives in
    #
    # Returns a new Device
    constructor: (opts = {}) ->
      @self = this
      @robot = opts.robot
      @name = opts.name
      @pin = opts.pin
      @connection = @determineConnection(opts.connection) or @defaultConnection()
      @driver = @initDriver(opts)
      proxyFunctionsToObject @driver.commands(), @driver, @self

    # Public: Starts the device driver
    #
    # callback - callback function to be executed by the driver start
    #
    # Returns result of supplied callback
    start: (callback) =>
      msg = "Starting device '#{ @name }'"
      msg += " on pin #{@pin}" if @pin?
      Logger.info msg
      @driver.start(callback)

    # Public: Stops the device driver
    #
    # Returns result of supplied callback
    stop: =>
      Logger.info "Stopping device '#{ @name }'"
      @driver.stop()

    # Public: Exports basic data for the Connection
    #
    # Returns an Object containing Connection data
    data: ->
      {
        name: @name
        driver: @driver.constructor.name || @driver.name
        pin: if @pin? then @pin.toString else null
        connection: @connection.data()
        commands: @driver.commands()
      }

    # Public: Retrieves the connections from the parent Robot instances
    #
    # c - name of the connection to fetch
    #
    # Returns a Connection instance
    determineConnection: (c) ->
      @robot.connections[c] if c

    # Public: Returns a default Connection to use
    #
    # Returns a Connection instance
    defaultConnection: ->
      first = 0
      for k, v of @robot.connections
        first or= v
      first

    # Public: sets up driver with @robot
    #
    # opts - object containing options when initializing driver
    #   driver - name of the driver to intt()
    #
    # Returns the set-up driver
    initDriver: (opts = {}) ->
      Logger.debug "Loading driver '#{ opts.driver }'"
      @robot.initDriver(opts.driver, @self, opts)

module.exports = Cylon.Device
