###
 * port
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

module.exports = class Port
  constructor: (data) ->
    @isTcp = @isSerial = @isPortless = false
    @parse(data)

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

  toString: ->
    if @isPortless
      "none"
    else if @isSerial
      @port
    else
      "#{@host}:#{@port}"
