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

namespace 'Cylon', ->
  class @Driver extends Cylon.Basestar
    constructor: (opts={}) ->
      @self = this
      @name = opts.name
      @device = opts.device
      @connection = @device.connection

    start: (callback) ->
      Logger.info "Driver #{@name} started"
      (callback)(null)
      @device.emit 'start'
      true

    stop: ->
      Logger.info "Driver #{@name} stopped"

    commands: ->
      []

