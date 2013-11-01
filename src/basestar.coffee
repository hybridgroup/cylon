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

    # proxies calls from all methods in klass to target
    proxyMethods: (methods, target, klass, force = false) ->
      proxyFunctionsToObject(methods, target, klass, force)

    # creates an event handler that proxies events from source object to target
    defineEvent: (opts) ->
     targetEventName = opts.targetEventName or opts.eventName
     sendUpdate = opts.sendUpdate or false
     opts.source.on opts.eventName, (args...) =>
       opts.target.emit(targetEventName, args)
       opts.target.emit('update', targetEventName, args) if sendUpdate

    # creates an event handler that proxies events from an adaptor object's 'connector'
    # (object reference to whatever module is actually talking to the hardware)
    # to the adaptor's associated connection
    defineAdaptorEvent: (opts) ->
      opts['source'] = @connector
      opts['target'] = @connection
      opts['sendUpdate'] ?= false
      @defineEvent(opts)

    # creates an event handler that proxies events from a driver object's 'connection'
    # to the driver's associated device
    defineDriverEvent: (opts) ->
      opts['source'] = @connection
      opts['target'] = @device
      opts['sendUpdate'] ?= true
      @defineEvent(opts)
