###
 * api
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

restify = require 'restify'
socketio = require 'socket.io'
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

      @server = restify.createServer(name: "Cylon API Server")
      @io = socketio.listen @server

      @server.get "/robots", @getRobots
      @server.get "/robots/:robotid", @getRobotByName
      @server.get "/robots/:robotid/devices", @getDevices
      @server.get "/robots/:robotid/devices/:deviceid", @getDeviceByName
      @server.get "/robots/:robotid/devices/:deviceid/commands", @getDeviceCommands
      @server.post "/robots/:robotid/devices/:deviceid/commands/:commandid", @runDeviceCommand

      @server.listen @port, @host, =>
        Logger.info "#{@server.name} is listening at #{@server.url}"

    getRobots: (req, res, next) ->
      res.send (robot.data() for robot in master.robots())

    getRobotByName: (req, res, next) ->
      master.findRobot req.params.robotid, (err, robot) ->
        res.send if err then err else robot.data()

    getDevices: (req, res, next) ->
      master.findRobot req.params.robotid, (err, robot) ->
        res.send if err then err else robot.data().devices

    getDeviceByName: (req, res, next) ->
      robotid = req.params.robotid
      deviceid = req.params.deviceid

      master.findRobotDevice robotid, deviceid, (err, device) ->
        res.send if err then err else device.data()

    getDeviceCommands: (req, res, next) ->
      robotid = req.params.robotid
      deviceid = req.params.deviceid

      master.findRobotDevice robotid, deviceid, (err, device) ->
        res.send if err then err else device.data().commands

    runDeviceCommand: (req, res, next) ->
