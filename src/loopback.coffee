###
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

module.exports =
  adaptor: (opts = {}) ->
    new Loopback(opts)

class Loopback
  self = this

  constructor: (opts) ->
    @name = opts.name

  connect: ->
    console.log  "Connecting to adaptor '#{@name}'..."
    self

  disconnect: ->
    console.log  "Disconnecting from adaptor '#{@name}'..."
