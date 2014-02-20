###
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

require './basestar'

# The Adaptor class is a base class for Adaptor classes in external Cylon
# modules to use. It offers basic functions for connecting/disconnecting that
# descendant classes can.
namespace 'Cylon', ->
  class @Adaptor extends Cylon.Basestar

    # Public: Creates a new Adaptor
    #
    # opts - hash of acceptable params
    #   name - name of the Adaptor, used when printing to console
    #   connection - Connection the adaptor will use to proxy commands/events
    #
    # Returns a new Adaptor
    constructor: (opts={}) ->
      @self = this
      @name = opts.name
      @connection = opts.connection
      @commandList = []

    # Public: Exposes all commands the adaptor will respond to/proxy
    #
    # Returns an array of string method names
    commands: ->
      @commandList

    # Public: Connects to the adaptor, and emits 'connect' from the @connection
    # when done.
    #
    # callback - function to run when the adaptor is connected
    #
    # Returns nothing
    connect: (callback) ->
      Logger.info "Connecting to adaptor '#{@name}'..."
      (callback)(null)
      @connection.emit 'connect'

    # Public: Disconnects from the adaptor
    #
    # Returns nothing
    disconnect: ->
      Logger.info "Disconnecting from adaptor '#{@name}'..."
