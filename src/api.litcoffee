# API

The Cylon API provides an interface for retreiving information and communicating
with the currently running robots.

First of all, let's make sure we're running in ECMAScript 5's [strict mode][].

    'use strict';

## Dependencies

Our server needs to primarily respond to HTTP requests with JSON responses, but
also needs to handle a WebSocket connection to listen for events. To accomodate
both of these requirements, we're going to use [express.io][].

    express = require 'express.io'

`express.io` integrates some [socket.io][] functionality on top of the popular
[express][] framework for Node. This lets us use the same server to handle both
types of connections, and also use Express-style routing to resolve to
a Socket.IO connection.

To keep in line with the rest of Cylon, we'll also be namespacing our API server
with the [node-namespace][] module.

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

[strict mode]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
[express.io]: http://express-io.org
[express]: http://expressjs.com
[socket.io]: http://socket.io
[jnode-namespace]: https://github.com/kaero/node-namespace
