# Pure Spheron

Here's an example of communicating with a Sphero solely using Spheron. Before
you get started, make sure you've installed the `spheron` module with NPM.

First, let's make sure we've got Spheron loaded:

    spheron = require 'spheron'

Next, we'll get our colors from Spheron's toolbelt:

    COLORS = spheron.toolbelt.COLORS

Let's also keep a reference to the port we'll be using to talk to the Sphero, as
well as the Sphero connection itself:

    sphero = spheron.sphero()
    spheroPort = "/dev/rfcomm0"

Now let's define the event listeners for our Sphero. When the connection is
opened, the sphero will let us know about it, and change it's color to green,
along with enabling collision detection.

    sphero.on 'open', ->
      console.log 'EVENT OPEN!'
      sphero.configureCollisionDetection 0x01, 0x20, 0x20, 0x20, 0x20, 0x50
      sphero.setRGB COLORS.GREEN, false

The rest are basic events, logging that a `close`, `error`, or `end` event has
been fired:

    sphero.on 'close', -> console.log 'EVENT CLOSE!'
    sphero.on 'end', -> console.log 'EVENT END!'
    sphero.on 'error', -> console.log 'EVENT ERROR!'

For the `notification` and `message` events, though, we're going to log their
accompanying data to the console as well:

    sphero.on 'notification', (packet) ->
      console.log "Packet contents: #{packet}"

    sphero.on 'message', (packet) ->
      console.log "Packet contents: #{packet}"

And that wraps up our event listeners. All that's left to do is open
a connection to the Sphero:

    sphero.open spheroPort
