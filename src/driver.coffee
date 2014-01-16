###
 * driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

require './basestar'

# The Driver class is a base class for Driver classes in external Cylon
# modules to use. It offers basic functions for starting/stopping that
# descendant classes can.
namespace 'Cylon', ->
  class @Driver extends Cylon.Basestar

    # Public: Creates a new Driver
    #
    # opts - hash of acceptable params
    #   name - name of the Driver, used when printing to console
    #   device - Device the driver will use to proxy commands/events
    #
    # Returns a new Driver
    constructor: (opts={}) ->
      @self = this
      @name = opts.name
      @device = opts.device
      @connection = @device.connection

    # Public: Exposes all commands the driver will respond to/proxy
    #
    # Returns an array of string method names
    commands: ->
      []

    # Public: Starts up the driver, and emits 'connect' from the @device
    # when done.
    #
    # callback - function to run when the driver is started
    #
    # Returns nothing
    start: (callback) ->
      Logger.info "Driver #{@name} started"
      (callback)(null)
      @device.emit 'start'
      true

    # Public: Stops the driver
    #
    # Returns nothing
    stop: ->
      Logger.info "Driver #{@name} stopped"
