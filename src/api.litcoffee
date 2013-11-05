# API

The Cylon API provides an interface for retreiving information and communicating
with the currently running robots.

First of all, let's make sure we're running in ECMAScript 5's [strict mode][].

[strict mode]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode

    'use strict';


## Dependencies

Our server needs to primarily respond to HTTP requests with JSON responses, but
also needs to handle a WebSocket connection to listen for events. To accomodate
both of these requirements, we're going to use [express.io][].

[express.io]: http://express-io.org

    express = require 'express.io'

`express.io` integrates some [socket.io][] functionality on top of the popular
[express][] framework for Node. This lets us use the same server to handle both
types of connections, and also use Express-style routing to resolve to
a Socket.IO connection.

[socket.io]: http://socket.io
[express]: http://expressjs.com

To keep in line with the rest of Cylon, we'll also be namespacing our API server
with the [node-namespace][] module.

[node-namespace]: https://github.com/kaero/node-namespace

    namespace = require 'node-namespace'

## Namespacing

First, let's namespace our server class so it's available to other parts of
Cylon:

    namespace 'Api', ->
      class @Server

Now from another module, you can just `require('./api')` and you automatically
have access to the API server via `Api.Server`.

## Master

We need to hold a class-wide reference to the Cylon instance that's started our
server instance, so we can inspect and send messages to all the robots it's
controlling. For now, we can set it to null, it will be changed later in the
constructor.

        master = null

## Constructor

The server constructor constructor accepts an arguments object, `opts`. This
defines options to be used when creating the server, as follows:

- **master** - required, reference to Cylon.Master instance that's creating the
  Server instance
- **host** - optional, string IP address that the server should host content
  from
- **port** - optional, string port number the server should listen for requests
  on

        constructor: (opts = {}) ->
          @host = opts.host || "127.0.0.1"
          @port = opts.port || "3000"

          master = opts.master

Once we have this information, we can create our server:

          @server = express().http().io()

Give it a name:

          @server.set 'name', 'Cylon API Server'

And tell it to use the `express.bodyParser()` mixin, which will parse body
params for POST requests:

          @server.use express.bodyParser()

We need to define a catch-all route here, that will specify that all our
responses will be JSON. Otherwise, Express will automatically send everything in
text/plain, possibly confusing clients.

          @server.get "/*", (req, res, next) ->
            res.set 'Content-Type', 'application/json'
            do next

Next up, we run a function to define all our routes (you'll see it in a minute)

          do @configureRoutes

And finally, we start our server, announcing so via the Logger.

          @server.listen @port, @host, =>
            Logger.info "#{@server.name} is listening at #{@host}:#{@port}"

## Routes

We'll use the previously referenced `@configureRoutes` function to define our
server's routes.

        configureRoutes: ->

### GET /robots

Our first route returns all the Robots the master class knows about in JSON
format.

          @server.get "/robots", (req, res) ->
            res.json (robot.data() for robot in master.robots())

### GET /robots/:robotname

Given a robot's name, returns JSON information about the requested Robot:

          @server.get "/robots/:robotname", (req, res) ->
            master.findRobot req.params.robotname, (err, robot) ->
              res.json if err then err else robot.data()

### GET /robots/:robotname/devices

Given a robot's name, returns JSON information about the devices belonging to
the requested Robot:

          @server.get "/robots/:robotname/devices", (req, res) ->
            master.findRobot req.params.robotname, (err, robot) ->
              res.json if err then err else robot.data().devices

### GET /robots/:robotname/devices/:devicename

Given the names of a device and the robot it belongs to, returns data on the
specified device.

          @server.get "/robots/:robotname/devices/:devicename", (req, res) ->
            params = [req.params.robotname, req.params.devicename]
            [robotname, devicename] = params

            master.findRobotDevice robotname, devicename, (err, device) ->
              res.json if err then err else device.data()

### GET /robots/:robotname/devices/:devicename/commands

Given the names of a device and the robot it belongs to, returns all commands
available for the specified device.

          @server.get "/robots/:robotname/devices/:devicename/commands", (req, res) ->
            params = [req.params.robotname, req.params.devicename]
            [robotname, devicename] = params

            master.findRobotDevice robotname, devicename, (err, device) ->
              res.json if err then err else device.data().commands

### POST /robots/:robotname/devices/:devicename/commands/:commandname

Given a robot name, device name, and command name, executes a robot's command
and returns the result.

          @server.post "/robots/:robot/devices/:device/commands/:commandname", (req, res) ->

            params = [
              req.params.robotname,
              req.params.devicename,
              req.params.commandname
            ]

            [robotname, devicename, commandname] = params

This parses params from the request body into values that can be used while
calling the command, if params have been supplied.

            params = []
            if typeof req.body is 'object'
              params.push(value) for key, value of req.body

Runs the command on the Robot's device, passing in params as provided.

            master.findRobotDevice robotname, devicename, (err, device) ->
              if err then return res.json err
              result = device[commandname](params...)
              res.json result: result

### GET /robots/:robotname/connections

Given a robot's name, returns JSON information about the connections belonging
to the requested Robot:

          @server.get "/robots/:robotname/connections", (req, res) ->
            master.findRobot req.params.robotname, (err, robot) ->
              res.json if err then err else robot.data().connections

### GET /robots/:robotname/connections/:connectionname

Given a robot's name, returns JSON information about the connections belonging
to the requested Robot:

          @server.get "/robots/:robot/connections/:connection", (req, res) ->
            params = [req.params.robot, req.params.connection]
            [robotname, connectionname] = params

            master.findRobotConnection robotname, connectionname, (err, connection) ->
              res.json if err then err else connection.data()

### GET /robots/:robotname/devices/:devicename/events

Routes to a Socket.IO route to handle WebSockets connections requesting updates
on device events.

          @server.get "/robots/:robotname/devices/:devicename/events", (req, res) ->
            req.io.route 'events'

### WS_GET /events

A Socket.IO route to handle updating clients whenever a device sends
an 'update' event.

Listens for the 'update' event on a particular Robot's device, and whenever the
device sends the 'update' event, passes the data along to the client.

          @server.io.route 'events', (req) ->
            params = [req.params.robotname, req.params.devicename]
            [robotname, devicename] = params

            master.findRobotDevice robotname, devicename, (err, device) ->
              req.io.respond(err) if err
              device.on 'update', (data) ->
                req.io.emit 'update', { data: data }
