###
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

Robot = require("./robot")

require('./utils')
require('./logger')

require('./api/api')

Logger.setup()

class Cylon
  instance = null

  @getInstance: (args...) ->
    instance ?= new Master(args...)

  class Master
    robots = []
    api = null

    constructor: ->
      @self = this

    robot: (opts) =>
      opts.master = this
      robot = new Robot(opts)
      robots.push robot
      robot

    robots: -> robots

    findRobot: (name) ->
      for robot in robots
        return robot if robot.name is name

    start: ->
      do @startAPI
      robot.start() for robot in robots

    startAPI: ->
      api ?= new Api.Server(master: @self)

module.exports = Cylon.getInstance()
