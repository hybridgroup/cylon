###
 * <%= adaptorName %>
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

require 'cylon'

module.exports =
  adaptor: (args...) ->
    # Provide a function that's an instance of your adaptor here. For example,
    # the Sphero adaptor creates a new instance of the Sphero adaptor class:
    #
    # new Cylon.Adaptor.Sphero(args...)
    return ->

  driver: (args...) ->
    # Provide a function that's an instance of your driver here. For example,
    # the Sphero adaptor creates a new instance of the Sphero driver class:
    #
    # new Cylon.Driver.Sphero(args...)
    return ->

  register: (robot) ->
    # Bootstrap your adaptor here. For example, with a Sphero, you would call
    # the registerAdaptor and registerDriver functions as follows:
    #
    # robot.registerAdaptor 'cylon-sphero', 'sphero'
    # robot.registerDriver 'cylon-sphero', 'sphero'
