###
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

exports.adaptor = (opts = {}) ->
  new Adaptor.Loopback(opts)

module.exports = class Adaptor.Loopback
  constructor: (opts) ->
    @name = opts.name

  connect: ->
    console.log  "Connecting to adaptor '#{@name}'..."

  disconnect: ->
    console.log  "Disconnecting from adaptor '#{@name}'..."
