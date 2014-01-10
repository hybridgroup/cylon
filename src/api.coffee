###
 * api
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

express = require 'express.io'
namespace = require 'node-namespace'

namespace 'Cylon', ->
  # The Cylon API Server provides an interface to communicate with master class
  # and retrieve information about the robots being controlled.
  class @ApiServer
    master = null

    constructor: (opts = {}) ->
      @host = opts.host || "127.0.0.1"
      @port = opts.port || "3000"

      master = opts.master

      @server = express().http().io()

      @server.set 'title', 'Cylon API Server'
      @server.use express.json()
      @server.use express.urlencoded()
      @server.use express.static __dirname + "/../api"

      @server.get "/*", (req, res, next) ->
        res.set 'Content-Type', 'application/json'
        do next

      do @configureRoutes

      @server.listen @port, @host, =>
        Logger.info "#{@server.get('title')} is listening on #{@host}:#{@port}"

    configureRoutes: ->
      @server.get "/robots", (req, res) ->
        res.json (robot.data() for robot in master.robots())

      @server.get "/robots/:robotname", (req, res) ->
        master.findRobot req.params.robotname, (err, robot) ->
          res.json if err then err else robot.data()

      @server.get "/robots/:robotname/commands", (req, res) ->
        master.findRobot req.params.robotname, (err, robot) ->
          res.json if err then err else robot.data().commands

      @server.all "/robots/:robotname/commands/:commandname", (req, res) ->
        params = []
        params.push(v) for _, v of req.body if typeof req.body is 'object'

        master.findRobot req.params.robotname, (err, robot) ->
          if err then return res.json err
          result = robot[req.params.commandname](params...)
          res.json result: result

      @server.get "/robots/:robotname/devices", (req, res) ->
        master.findRobot req.params.robotname, (err, robot) ->
          res.json if err then err else robot.data().devices

      @server.get "/robots/:robotname/devices/:devicename", (req, res) ->
        [robotname, devicename] = [req.params.robotname, req.params.devicename]

        master.findRobotDevice robotname, devicename, (err, device) ->
          res.json if err then err else device.data()

      @server.get "/robots/:robotname/devices/:devicename/commands", (req, res) ->
        [robotname, devicename] = [req.params.robotname, req.params.devicename]

        master.findRobotDevice robotname, devicename, (err, device) ->
          res.json if err then err else device.data().commands

      @server.all "/robots/:robot/devices/:device/commands/:commandname", (req, res) ->
        params = [req.params.robot, req.params.device, req.params.commandname]
        [robotname, devicename, commandname] = params

        params = []
        params.push(v) for _, v of req.body if typeof req.body is 'object'

        master.findRobotDevice robotname, devicename, (err, device) ->
          if err then return res.json err
          result = device[commandname](params...)
          res.json result: result

      @server.get "/robots/:robotname/connections", (req, res) ->
        master.findRobot req.params.robotname, (err, robot) ->
          res.json if err then err else robot.data().connections

      @server.get "/robots/:robot/connections/:connection", (req, res) ->
        [robotname, connectionname] = [req.params.robot, req.params.connection]

        master.findRobotConnection robotname, connectionname, (err, connection) ->
          res.json if err then err else connection.data()

      @server.get "/robots/:robotname/devices/:devicename/events", (req, res) ->
        req.io.route 'events'

      @server.io.route 'events', (req) ->
        [robotname, devicename] = [req.params.robotname, req.params.devicename]

        master.findRobotDevice robotname, devicename, (err, device) ->
          req.io.respond(err) if err
          device.on 'update', (data) ->
            req.io.emit 'update', { data: data }

module.exports = Cylon.ApiServer
