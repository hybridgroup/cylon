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

    proxyEvent: (eventName, onSource, emitSource, updEvt = false) ->
      onSource.on(eventName, (args...) =>
        emitSource.emit(eventName, args)
        emitSource.emit('update', eventName, args) if updEvt
      )

    proxyAdaptorEvent: (params) ->
      @proxyEvent(params.on, @connector, @connection, params.emitUpdate)

    proxyDriverEvent: (params) ->
      @proxyEvent(params.on, @connection, @device, params.emitUpdate)

    createEvent: (onEvent, onSource, emitEvent, emitSource, updEvt = false ) ->
      onSource.on(onEvent, (args...) =>
        emitSource.emit(emitEvent, args)
        emitSource.emit('update', emitEvent, args) if updEvt
      )

    createAdaptorEvent: (params) ->
      @createEvent(params.on, @connector, params.emit, @connection, params.emitUpdate)

    createDriverEvent: (params) ->
      @createEvent(params.on, @connection, params.emit, @device, params.emitUpdate)
