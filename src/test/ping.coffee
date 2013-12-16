###
 * Ping driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

module.exports =
  driver: (args...) ->
    new Cylon.Drivers.Ping(args...)

namespace 'Cylon.Drivers', ->
  class @Ping extends Cylon.Driver
    commands: ->
      ['ping']

    ping: ->
      "pong"
