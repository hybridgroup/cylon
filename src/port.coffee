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
    [@isTcp, @isSerial, @isPortless] = [false, false, false]
    @parse(data)

  parse: (data) ->
    @host = "localhost"
    @port = "4567"
    # TODO: actual parsing of the incoming data string

  toString: ->
    "#{@host}:#{@port}"
