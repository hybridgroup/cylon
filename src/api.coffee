'use strict'

express = require 'express.io'

namespace = require 'node-namespace'

namespace 'Api', ->
  class @Server

    master = null

    constructor: (opts = {}) ->
      @host = opts.host || "127.0.0.1"
      @port = opts.port || "3000"

      master = opts.master

      @server = express().http().io()

      @server.set 'name', 'Cylon API Server'

      @server.use express.bodyParser()

      @server.get "/*", (req, res, next) ->
        res.set 'Content-Type', 'application/json'
        do next

      do @configureRoutes

      @server.listen @port, @host, =>
        Logger.info "#{@server.name} is listening at #{@host}:#{@port}"

    configureRoutes: ->

      @server.get "/robots", (req, res) ->
        res.json (robot.data() for robot in master.robots())

      @server.get "/robots/:robotname", (req, res) ->
        master.findRobot req.params.robotname, (err, robot) ->
          res.json if err then err else robot.data()

      @server.get "/robots/:robotname/devices", (req, res) ->
        master.findRobot req.params.robotname, (err, robot) ->
          res.json if err then err else robot.data().devices

      @server.get "/robots/:robotname/devices/:devicename", (req, res) ->
        params = [req.params.robotname, req.params.devicename]
        [robotname, devicename] = params

        master.findRobotDevice robotname, devicename, (err, device) ->
          res.json if err then err else device.data()

      @server.get "/robots/:robotname/devices/:devicename/commands", (req, res) ->
        params = [req.params.robotname, req.params.devicename]
        [robotname, devicename] = params

        master.findRobotDevice robotname, devicename, (err, device) ->
          res.json if err then err else device.data().commands

      @server.all "/robots/:robot/devices/:device/commands/:commandname", (req, res) ->

        params = [
          req.params.robot,
          req.params.device,
          req.params.commandname
        ]

        [robotname, devicename, commandname] = params

        params = []
        if typeof req.body is 'object'
          params.push(value) for key, value of req.body

        master.findRobotDevice robotname, devicename, (err, device) ->
          if err then return res.json err
          result = device[commandname](params...)
          res.json result: result

      @server.get "/robots/:robotname/connections", (req, res) ->
        master.findRobot req.params.robotname, (err, robot) ->
          res.json if err then err else robot.data().connections

      @server.get "/robots/:robot/connections/:connection", (req, res) ->
        params = [req.params.robot, req.params.connection]
        [robotname, connectionname] = params

        master.findRobotConnection robotname, connectionname, (err, connection) ->
          res.json if err then err else connection.data()

      @server.get "/robots/:robotname/devices/:devicename/events", (req, res) ->
        req.io.route 'events'

      @server.io.route 'events', (req) ->
        params = [req.params.robotname, req.params.devicename]
        [robotname, devicename] = params

        master.findRobotDevice robotname, devicename, (err, device) ->
          req.io.respond(err) if err
          device.on 'update', (data) ->
            req.io.emit 'update', { data: data }
