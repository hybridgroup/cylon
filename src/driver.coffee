###
 * driver
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

module.exports = class Driver
  self = this
  
  constructor: (opts) ->
    @name = opts.name

  start: ->
    Logger.info "started"

  commands: ->
    ['smile', 'laugh', 'help']
