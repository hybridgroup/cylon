###
 * Loopback adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

module.exports =
  adaptor: (args...) ->
    new Adaptor.Loopback(args...)

Adaptor =
  Loopback: class Loopback
    constructor: (opts) ->
      @self = this
      @name = opts.name

    connect: ->
      Logger.info "Connecting to adaptor '#{@name}'..."
      @self

    disconnect: ->
      Logger.info "Disconnecting from adaptor '#{@name}'..."

    commands: ->
      ['ping']
