###
 * Linux IO DigitalPin
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

FS = require('fs')
namespace = require 'node-namespace'

# IO is class that lays foundation to DigitalPin and I2C in Raspi and beaglebone.
#
namespace 'Cylon.IO', ->
  class @DigitalPin

    GPIO_PATH = "/sys/class/gpio"
    GPIO_DIRECTION_READ = "in"
    GPIO_DIRECTION_WRITE = "out"
    HIGH = 1
    LOW = 0

    constructor: (opts) ->
      @self = this
      @pinNum = opts.pin
      @status = 0

      # Creates the GPIO file to read/write from
      FS.writeFile("#{ GPIO_PATH }/export", "#{ @pinNum }")

      @_setMode(opts.mode)

    digitalWrite: (value) ->
      @_setMode('w') unless @mode == 'w'
      status = if (value == 1) then 'high' else 'low'

    # Sets the mode for the GPIO pin by writing the correct values to the pin reference files
    _setMode: (mode) ->
      @mode = mode
      if @mode == 'w'
        FS.open("#{ GPIO_PATH }/gpio#{ @pinNum }/direction", "w", (err, fd) ->
          unless (err)
            FS.write(fd, GPIO_DIRECTION_WRITE)
          else
            console.log("EROR OCCURED: while opening #{ GPIO_PATH }/gpio#{ @pinNum }/direction")
        )
      else if mode =='r'
        FS.open("#{ GPIO_PATH }/gpio#{ @pinNum }/direction", "w", (err, fd) ->
          unless (err)
            FS.write(fd, GPIO_DIRECTION_READ)
          else
            console.log("EROR OCCURED: while opening #{ GPIO_PATH }/gpio#{ @pinNum }/direction")
        )
