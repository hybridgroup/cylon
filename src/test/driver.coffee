###
 * driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

# A test class, used to create dummy Drivers
namespace 'Cylon', ->
  class @Driver
    constructor: (opts) ->
      @self = this
      @name = opts.name

    start: ->
      Logger.info "started"

    commands: ->
      ['smile', 'laugh', 'help']

module.exports = Cylon.Driver
