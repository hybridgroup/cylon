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

      @routes @server

      @server.listen @port, @host, =>
        Logger.info "#{@server.name} is listening at #{@host}:#{@port}"

    routes: (server) ->
      server.get "/robots", @getRobots
      server.get "/robots/:robotid", @getRobotByName
      server.get "/robots/:robotid/devices", @getDevices
      server.get "/robots/:robotid/devices/:deviceid", @getDeviceByName
      server.get "/robots/:robotid/devices/:deviceid/commands", @getDeviceCommands
      server.post "/robots/:robotid/devices/:deviceid/commands/:commandid", @runDeviceCommand
      server.get "/robots/:robotid/connections", @getConnections
      server.get "/robots/:robotid/connections/:connectionid", @getConnectionByName

      server.get "/robots/:robotid/devices/:deviceid/events", (req, res) ->
        req.io.route 'events'
      server.io.route 'events', @ioSetupDeviceEventClient

    getRobots: (req, res) ->
      res.json (robot.data() for robot in master.robots())

    getRobotByName: (req, res) ->
      master.findRobot req.params.robotid, (err, robot) ->
        res.json if err then err else robot.data()

    getDevices: (req, res) ->
      master.findRobot req.params.robotid, (err, robot) ->
        res.json if err then err else robot.data().devices

    getDeviceByName: (req, res) ->
      robotid = req.params.robotid
      deviceid = req.params.deviceid

      master.findRobotDevice robotid, deviceid, (err, device) ->
        res.json if err then err else device.data()

    getDeviceCommands: (req, res) ->
      robotid = req.params.robotid
      deviceid = req.params.deviceid

      master.findRobotDevice robotid, deviceid, (err, device) ->
        res.json if err then err else device.data().commands

    runDeviceCommand: (req, res) ->
      robotid = req.params.robotid
      deviceid = req.params.deviceid
      commandid = req.params.commandid

      params = []
      if typeof req.body is 'object'
        params.push(value) for key, value of req.body

      master.findRobotDevice robotid, deviceid, (err, device) ->
        if err then return res.json err
        result = device[commandid](params...)
        res.json result: result

    getConnections: (req, res) ->
      master.findRobot req.params.robotid, (err, robot) ->
        res.json if err then err else robot.data().connections

    getConnectionByName: (req, res) ->
      robotid = req.params.robotid
      connectionid = req.params.connectionid

      master.findRobotConnection robotid, connectionid, (err, connection) ->
        res.json if err then err else connection.data()

    ioSetupDeviceEventClient: (req) ->
      robotid = req.params.robotid
      deviceid = req.params.deviceid

      master.findRobotDevice robotid, deviceid, (err, device) ->
        res.io.respond(err) if err
        device.on 'update', (data) -> res.io.respond { data: data }
