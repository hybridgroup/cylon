###
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

Port = source("port")

module.exports = class Connection
  constructor: (opts) ->
    opts ?= {}
    @name = opts.name
    @adaptor = opts.adaptor
    @port = new Port(opts.port)

  start: ->
    console.log "started"

