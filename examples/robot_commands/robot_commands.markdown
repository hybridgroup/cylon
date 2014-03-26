# Robot Commands

This example demonstrates a feature of the Cylon API: running arbitrary commands
on robots over HTTP. To demonstrate this, we're going to make a basic robot,
with a custom command. This in and of itself is nothing to write home about, but
you'll be able to trigger the custom command by visiting this URL in your
browser:

```
http://localhost:8080/robots/frankie/commands/relax
```

First, let's make sure to load up Cylon:

    Cylon = require '../..'

Now that we've got that, let's set up a custom API port:

    Cylon.api host: '0.0.0.0', port: '8080'

And with that done let's define our robot. We'll make a class to contain this
robot's logic:

    class MyRobot

To let the API know what commands this robot has, we need to provide a `commands` array.

      commands: ["relax"]

And with that done, we can now define the method. The result of this method will
be returned to the HTTP client as part of a JSON object.

      relax: ->
        "#{this.name} says relax"

Since we don't really care what actual work this robot does, but need to keep it
busy, we'll just tell it to print it's name every second.

      work: (me) ->
        every 1.seconds(), ->
          console.log me.name

And with that all done, we can now instantiate our robot:

    robot = new MyRobot

Now we can just give it a name and send it off to Cylon.

    robot.name = "frankie"
    Cylon.robot robot

And now that all the pieces are in place, we can start up Cylon:

    Cylon.start()

Now the robot will print it's name to the console, and Cylon will serve an API
to `localhost:8080`. Check it out!.
