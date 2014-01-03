###
 * Linux IO DigitalPin
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

FS = require 'fs'
EventEmitter = require('events').EventEmitter

namespace = require 'node-namespace'

# DigitalPin class offers an interface with the Linux GPIO system present in
# single-board computers such as a Raspberry Pi, or a BeagleBone
namespace 'Cylon.IO', ->
  class @DigitalPin extends EventEmitter

    GPIO_PATH = "/sys/class/gpio"
    GPIO_READ = "in"
    GPIO_WRITE = "out"
    HIGH = 1
    LOW = 0

    constructor: (opts) ->
      @pinNum = opts.pin
      @status = 'low'
      @ready = false
      @mode = opts.mode

    connect: (mode = null) ->
      @mode ?= mode

      # Check if the pin acceess file is already in the GPIO folder
      FS.exists @_pinPath(), (exists) =>
        if exists then @_openPin() else @_createGPIOPin()

    close: ->
      FS.writeFile @_unexportPath(), "#{@pinNum}", (err) =>
        @_closeCallback(err)

    closeSync: ->
      FS.writeFileSync @_unexportPath(), "#{@pinNum}"
      @_closeCallback(false)

    digitalWrite: (value) ->
      @_setMode('w') unless @mode is 'w'
      @status = if value is 1 then 'high' else 'low'

      FS.writeFile @_valuePath(), value, (err) =>
        if err
          @emit 'error', "Error occurred while writing value #{value} to pin #{@pinNum}"
        else
          @emit 'digitalWrite', value

      value

    # Public: Reads the digial pin's value periodicly on a supplied interval,
    # and emits the result or an error
    #
    # interval - time (in milliseconds) to read from the pin at
    #
    # Returns the defined interval
    digitalRead: (interval) ->
      @_setMode('r') unless @mode is 'r'
      readData = null

      every interval,  =>
        FS.readFile @_valuePath(), (err, data) =>
          if err
            @emit 'error', "Error occurred while reading from pin #{ @pinNum }"
          else
            readData = parseInt(data.toString())
            @emit 'digitalRead', readData

    setHigh: ->
      @digitalWrite 1

    setLow: ->
      @digitalWrite 0

    toggle: ->
      if @status is 'low' then @setHigh() else @setLow()

    # Creates the GPIO file to read/write from
    _createGPIOPin: () ->
      FS.writeFile @_exportPath(), "#{ @pinNum }", (err) =>
        if err
          @emit 'error', 'Error while creating pin files'
        else
          @_openPin()

    _openPin: () ->
      @_setMode @mode, true
      @emit 'open'

    _closeCallback: (err) ->
      if err
        @emit 'error', 'Error while closing pin files'
      else
        @emit 'close', @pinNum

    # Sets the mode for the GPIO pin by writing the correct values to the pin reference files
    _setMode: (mode, emitConnect = false) ->
      @mode = mode
      if mode is 'w'
        FS.writeFile @_directionPath(), GPIO_WRITE, (err) =>
          @_setModeCallback err, emitConnect

      else if mode is 'r'
        FS.writeFile @_directionPath(), GPIO_READ, (err) =>
          @_setModeCallback err, emitConnect

    _setModeCallback: (err, emitConnect) ->
      if err
        @emit 'error', "Setting up pin direction failed"
      else
        @ready = true
        @emit('connect', @mode) if emitConnect

    _directionPath: () ->
      "#{ @_pinPath() }/direction"

    _valuePath: () ->
      "#{ @_pinPath() }/value"

    _pinPath: () ->
      "#{ GPIO_PATH }/gpio#{ @pinNum }"

    _exportPath: () ->
       "#{ GPIO_PATH }/export"

    _unexportPath: () ->
       "#{ GPIO_PATH }/unexport"
