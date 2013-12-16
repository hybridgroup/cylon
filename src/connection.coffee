###
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

require "./robot"
require "./port"
require "./adaptor"

namespace = require 'node-namespace'
EventEmitter = require('events').EventEmitter

# The Connection class represents the interface to
# a specific group of hardware devices. Examples would be an
# Arduino, a Sphero, or an ARDrone.
namespace 'Cylon', ->
  class @Connection extends EventEmitter

    # Public: Creates a new Connection
    # @opts - a hash of acceptable params:
    #   - id - a string ID for the connection
    #   - name - a name for the connection
    #   - robot - Robot the Connection belongs to
    #   - adaptor - the string module of the adaptor to be set up
    #   - port - a port to use for the Connection
    #
    # Returns the newly set-up connection
    constructor: (opts = {}) ->
      opts.id ?= Math.floor(Math.random() * 10000)
      @self = this
      @robot = opts.robot
      @name = opts.name
      @connection_id = opts.id
      @adaptor = @initAdaptor opts
      @port = new Cylon.Port opts.port
      proxyFunctionsToObject @adaptor.commands(), @adaptor, @self

    # Public: Exports basic data for the Connection
    #
    # Returns an Object containing Connection data
    data: ->
      {
        name: @name,
        port: @port.toString()
        adaptor: @adaptor.constructor.name || @adaptor.name
        connection_id: @connection_id
      }

    # Public: Connect the adaptor's connection
    #
    # callback - callback function to run when the adaptor is connected
    #
    # Returns the result of the supplied callback function
    connect: (callback) =>
      msg = "Connecting to '#{@name}'"
      msg += " on port '#{@port.toString()}'" if @port?
      Logger.info msg
      @adaptor.connect(callback)

    # Public: Disconnect the adaptor's connection
    #
    # Returns nothing
    disconnect: ->
      msg = "Disconnecting from '#{@name}'"
      msg += " on port '#{@port.toString()}'" if @port?
      Logger.info msg
      @adaptor.disconnect()

    # Public: sets up adaptor with @robot
    #
    # opts - options for adaptor being initialized
    #   adaptor - name of the adaptor
    #
    # Returns the set-up adaptor
    initAdaptor: (opts) ->
      Logger.debug "Loading adaptor '#{opts.adaptor}'"
      @robot.initAdaptor(opts.adaptor, @self, opts)

module.exports = Cylon.Connection
