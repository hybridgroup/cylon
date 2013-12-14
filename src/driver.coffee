###
 * driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

namespace 'Cylon.Drivers', ->
  class @Driver
    constructor: (opts) ->
      @self = this
      @name = opts.name
      @device = opts.device

    start: ->
      Logger.info "Driver #{@name} started"

    stop: ->
      Logger.info "Driver #{@name} stopped"

    commands: ->
      []

module.exports = Cylon.Drivers.Driver
