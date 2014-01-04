# Sphero Messages

For this Cylon example, we're going to hook up to a Sphero, and respond to
a number of events the Sphero adaptor is capable of emitting. Before we get
started, make sure you've got the `cylon-sphero` module installed.

To get started, let's import the Cylon module:

    Cylon = require '../..'

With that set up, we can start defining our robot:

    Cylon.robot

As with other Sphero examples, we'll have one connection and one device, both
the same Sphero.

      connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' }
      device: { name: 'sphero', driver: 'sphero' }

And now we can start defining our robot's work.

      work: (me) ->

When the Sphero's connected, we want to set up collision detection and change
it's color.

        me.sphero.on 'connect', ->
          console.log "Setting up Collision Detection..."
          me.sphero.detectCollisions()
          me.sphero.setRGB 0x00FF00

When the Sphero emits an 'update' event, we want to log the data it's provided
to us:

        me.sphero.on 'update', (data) ->
          console.log "Update event eventName: #{data} "
          console.log "Update event args: "
          console.log data

Similarly, when we get a message from the Sphero, we want to log the data, but
we'll also change it's color while we're at it.

        me.sphero.on 'message', (data) ->
          me.sphero.setRGB 0x0000FF
          console.log "Message:"
          console.log data

In the event of a collision, we want to change the color of the Sphero again, as
well as logging the data provided by the collision event.

        me.sphero.on 'collision', (data) ->
          me.sphero.setRGB 0xFF0000
          console.log "Collision:"
          console.log data

And, last but not least, when we get a notification event we want to record it's
data and change the color.

        me.sphero.on 'notification', (data) ->
          me.sphero.setRGB 0xFF0000
          console.log "Notification:"
          console.log data

And with all that done, we can finally start the robot.

    .start()
