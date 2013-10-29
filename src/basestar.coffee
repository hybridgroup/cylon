###
 * basestar
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

namespace = require 'node-namespace'
EventEmitter = require('events').EventEmitter
require './utils'

# Basestar is the class used when writing external Cylon adaptors/drivers.
#
# It provides some useful methods and behaviour.
namespace 'Cylon', ->
  class @Basestar extends EventEmitter
    constructor: (opts) ->
      @self = this

    proxyMethods: (methods, target, klass, force = false) ->
      proxyFunctionsToObject(methods, target, klass, force)
