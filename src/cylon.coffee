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

    findRobot: (name, callback) ->
      robot = null
      for bot in robots
        robot = bot if bot.name is name

      error = { error: "No Robot found with the name #{name}" } unless robot?

      if callback then callback(error, robot) else robot

    findRobotDevice: (robotid, deviceid, callback) ->
      @findRobot robotid, (err, robot) ->
        callback(err, robot) if err

        device = robot.devices[deviceid] if robot.devices[deviceid]
        unless device?
          error = { error: "No device found with the name #{device}." }

        if callback then callback(error, device) else device

    start: ->
      do @startAPI
      robot.start() for robot in robots

    startAPI: ->
      api ?= new Api.Server(master: @self)

module.exports = Cylon.getInstance()
