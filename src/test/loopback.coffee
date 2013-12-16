###
 * Loopback adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

module.exports =
  adaptor: (args...) ->
    new Cylon.Adaptors.Loopback(args...)

namespace 'Cylon.Adaptors', ->
  class @Loopback extends Cylon.Adaptor
    commands: ->
      ['ping']
