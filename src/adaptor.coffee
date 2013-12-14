###
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

namespace 'Cylon.Adaptors', ->
  class @Adaptor
    constructor: (opts) ->
      @self = this
      @name = opts.name
      @connection = opts.connection

    commands: ->
      []

    connect: (callback) ->
      Logger.info "Connecting to adaptor '#{@name}'..."
      (callback)(null)
      @connection.emit 'connect'

    disconnect: ->
      Logger.info "Disconnecting from adaptor '#{@name}'..."

module.exports = Cylon.Adaptors.Adaptor
