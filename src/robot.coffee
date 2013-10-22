###
 * robot
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

nactor = require 'nactor'

Connection = source("connection")
Device = source("device")
RobotActor = source("actors/robot")

module.exports = class Robot
  constructor: (opts = {}) ->
    @actor = nactor.actor(RobotActor)
    @actor.init(opts)
    return @actor
