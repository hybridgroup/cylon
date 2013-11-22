###
 * port
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

# The Port class represents a port and/or host to be used to connect to
# a specific hardware device
namespace 'Cylon', ->
  class @Port
    # Public: Creates a new Port based on a passed String representation
    #
    # data - string representation of the Port
    #
    # Returns a new Port
    constructor: (data) ->
      @self = this
      @isTcp = @isSerial = @isPortless = false
      @parse(data)

    # Public: Parses the Port's data to determine what kind of port it is
    #
    # data - string representation of the port to parse
    #
    # Returns nothing.
    parse: (data) ->
      if data is undefined
        @port = undefined
        @isPortless = true

      # is TCP host/port?
      else if match = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})/.exec(data)
        @port = match[2]
        @host = match[1]
        @isTcp = true

      # is it a numeric port for localhost tcp?
      else if /^[0-9]{1,5}$/.exec(data)
        @port = data
        @host = "localhost"
        @isTcp = true

      # must be a serial port
      else
        @port = data
        @host = undefined
        @isSerial = true

    # Public: Returns a string representation of the port that can be used to
    # connect to it.
    #
    # Returns a string
    toString: ->
      if @isPortless
        "none"
      else if @isSerial
        @port
      else
        "#{@host}:#{@port}"

module.exports = Cylon.Port
