###
 * Ping driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

module.exports =
  driver: (args...) ->
    new Driver.Ping(args...)

Driver =
  Ping: class Ping
    constructor: (opts) ->
      @self = this
      @name = opts.name

    commands: ->
      ['ping']

    start: (callback) ->
      Logger.info "Starting driver '#{@name}'..."
      (callback)(null)

    ping: ->
      "pong"
