###
 * Linux IO
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

namespace = require 'node-namespace'

# IO is class that lays foundation to DigitalPin and I2C in Raspi and beaglebone.
#
namespace 'Cylon', ->
  class @IO
    constructor: (opts) ->
      @self = this

