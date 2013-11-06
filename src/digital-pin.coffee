###
 * Linux IO DigitalPin
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

FS = require('fs')
EventEmitter = require('events').EventEmitter

namespace = require 'node-namespace'

# DigitalPin class to interface with linux GPIO in raspi and beaglebone
#
namespace 'Cylon.IO', ->
  class @DigitalPin extends EventEmitter

    GPIO_PATH = "/sys/class/gpio"
    GPIO_DIRECTION_READ = "in"
    GPIO_DIRECTION_WRITE = "out"
    HIGH = 1
    LOW = 0

    constructor: (opts) ->
      @self = this
      @pinNum = opts.pin
      @status = 'low'
      @ready = false
      @mode = opts.mode

    connect: (mode = null) ->
      @mode ?= mode
      # Creates the GPIO file to read/write from
      FS.writeFile("#{ GPIO_PATH }/export", "#{ @pinNum }", (err) =>
        if(err)
          @self.emit('error', 'Error while creating pin files')
        else
          @self._setMode(@mode, true)
          @self.emit('open')
      )


    close: ->
      FS.writeFile("#{ GPIO_PATH }/unexport", "#{ @pinNum }", (err) =>
        if(err)
          @self.emit('error', 'Error while closing pin files')
        else
          @self.emit('close')
      )

    digitalWrite: (value) ->
      @self._setMode('w') unless @mode == 'w'
      @status = if (value == 1) then 'high' else 'low'

      FS.writeFile(@pinFile, value, (err) =>
        if (err)
          @self.emit('error', "Error occurred while writing value #{ value } to pin #{ @pinNum }")
        else
          @self.emit('digitalWrite', value)
      )

    digitalRead: (interval) ->
      @self._setMode('r') unless @mode == 'r'
      readData = null

      setInterval(() =>
        FS.readFile(@pinFile, (err, data) =>
          if err
            @self.emit('error', "Error occurred while reading from pin #{ @pinNum }")
          else
            readData = data
            @self.emit('digitalRead', data)
        )
      , interval)

    # Sets the mode for the GPIO pin by writing the correct values to the pin reference files
    _setMode: (mode, emitConnect = false) ->
      if mode == 'w'
        FS.writeFile("#{ GPIO_PATH }/gpio#{ @pinNum }/direction", GPIO_DIRECTION_WRITE, (err) =>
          if (err)
            @self.emit('error', "Setting up pin direction failed")
          else
            @pinFile = "#{ GPIO_PATH }/gpio#{ @pinNum }/value"
            @ready = true
            @self.emit('connect', mode) if emitConnect
        )
      else if mode =='r'
        FS.writeFile("#{ GPIO_PATH }/gpio#{ @pinNum }/direction", GPIO_DIRECTION_READ, (err) =>
          if (err)
            @self.emit('error', "Setting up pin direction failed")
          else
            @pinFile = "#{ GPIO_PATH }/gpio#{ @pinNum }/value"
            @ready = true
            @self.emit('connect', mode) if emitConnect
        )

    setHigh: ->
      @self.digitalWrite(1)

    setLow: ->
      @self.digitalWrite(0)

    toggle: ->
      if @status == 'low'
        @self.setHigh()
      else
        @self.setLow()
