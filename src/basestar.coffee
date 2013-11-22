###
 * basestar
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

require './utils'

namespace = require 'node-namespace'

EventEmitter = require('events').EventEmitter

# Basestar is a base class to be used when writing external Cylon adaptors and
# drivers. It provides some useful base methods and functionality
#
# It also extends EventEmitter, so child classes are capable of emitting events
# for other parts of the system to handle.
namespace 'Cylon', ->
  class @Basestar extends EventEmitter
    constructor: (opts) ->
      @self = this

    # Public: Proxies calls from all methods in the object to a target object
    #
    # methods - array of methods to proxy
    # target - object to proxy methods to
    # source - object to proxy methods from
    # force - whether or not to overwrite existing method definitions
    #
    # Returns the klass where the methods have been proxied
    proxyMethods: (methods, target, source, force = false) ->
      proxyFunctionsToObject(methods, target, source, force)

    # Public: Defines an event handler that proxies events from a source object
    # to a target object
    #
    # opts - object containing options:
    #   - targetEventName or eventName - event that should be emitted from the
    #                                    target
    #   - target - object to proxy event to
    #   - source - object to proxy event from
    #   - update - whether or not to send an 'update' event
    #
    # Returns the source
    defineEvent: (opts) ->
     targetEventName = opts.targetEventName or opts.eventName
     sendUpdate = opts.sendUpdate or false
     opts.source.on opts.eventName, (args...) =>
       opts.target.emit(targetEventName, args...)
       opts.target.emit('update', targetEventName, args...) if sendUpdate

     opts.source

    # Public: Creates an event handler that proxies events from an adaptor's
    # 'connector' (reference to whatever module is actually talking to the hw)
    # to the adaptor's associated connection.
    #
    # opts - hash of opts to be passed to defineEvent()
    #
    # Returns @connector
    defineAdaptorEvent: (opts) ->
      opts['source'] = @connector
      opts['target'] = @connection
      opts['sendUpdate'] ?= false
      @defineEvent(opts)

    # Public: Creates an event handler that proxies events from an device's
    # 'connector' (reference to whatever module is actually talking to the hw)
    # to the device's associated connection.
    #
    # opts - hash of opts to be passed to defineEvent()
    #
    # Returns @connection
    defineDriverEvent: (opts) ->
      opts['source'] = @connection
      opts['target'] = @device
      opts['sendUpdate'] ?= true
      @defineEvent(opts)
