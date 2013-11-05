###
 * api
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

express = require('express.io')
namespace = require 'node-namespace'

namespace "Api", ->
  # The Cylon API Server provides an interface to communicate with master class
  # and retrieve information about the robots being controlled.
  class @Server
    master = null

    constructor: (opts = {}) ->
      @host = opts.host || "127.0.0.1"
      @port = opts.port || "3000"

      master = opts.master

      @server = express().http().io()
      @server.set 'name', 'Cylon API Server'
      @server.use(express.bodyParser())

      @server.get "/*", (req, res, next) ->
        res.set 'Content-Type', 'application/json'
        do next

      do @configureRoutes

      @server.listen @port, @host, =>
        Logger.info "#{@server.name} is listening at #{@host}:#{@port}"

    configureRoutes: ->
      @server.get "/robots", (req, res) ->
        res.json (robot.data() for robot in master.robots())

      @server.get "/robots/:robotid", (req, res) ->
        master.findRobot req.params.robotid, (err, robot) ->
          res.json if err then err else robot.data()

      @server.get "/robots/:robotid/devices", (req, res) ->
        master.findRobot req.params.robotid, (err, robot) ->
          res.json if err then err else robot.data().devices

      @server.get "/robots/:robotid/devices/:deviceid", (req, res) ->
        [robotid, deviceid] = [req.params.robotid, req.params.deviceid]
        master.findRobotDevice robotid, deviceid, (err, device) ->
          res.json if err then err else device.data()

      @server.get "/robots/:robotid/devices/:deviceid/commands", (req, res) ->
        [robotid, deviceid] = [req.params.robotid, req.params.deviceid]
        master.findRobotDevice robotid, deviceid, (err, device) ->
          res.json if err then err else device.data().commands

      @server.post "/robots/:robot/devices/:device/commands/:command", (req, res) ->
        params = [req.params.robot, req.params.device, req.params.command]
        [robotid, deviceid, commandid] = params

        params = []
        if typeof req.body is 'object'
          params.push(value) for key, value of req.body

        master.findRobotDevice robotid, deviceid, (err, device) ->
          if err then return res.json err
          result = device[commandid](params...)
          res.json result: result

      @server.get "/robots/:robotid/connections", (req, res) ->
        master.findRobot req.params.robotid, (err, robot) ->
          res.json if err then err else robot.data().connections

      @server.get "/robots/:robot/connections/:connection", (req, res) ->
        [robotid, connectionid] = [req.params.robot, req.params.connection]

        master.findRobotConnection robotid, connectionid, (err, connection) ->
          res.json if err then err else connection.data()

      @server.get "/robots/:robotid/devices/:deviceid/events", (req, res) ->
        req.io.route 'events'

      @server.io.route 'events', (req) ->
        [robotid, deviceid] = [req.params.robotid, req.params.deviceid]

        master.findRobotDevice robotid, deviceid, (err, device) ->
          res.io.respond(err) if err
          device.on 'update', (data) -> res.io.respond { data: data }
