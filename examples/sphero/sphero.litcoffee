# Sphero

For this Cylon example, we're going to politely ask a Sphero to roll in a random
direction, and to change it's direction every second. Before we get started,
make sure you've got the `cylon-sphero` module installed.

First, let's import Cylon:

    Cylon = require '../..'

With that done, we can now start defining our robot:

    Cylon.robot

We'll be using one connection and one device, both the Sphero.

      connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' }
      device: { name: 'sphero', driver: 'sphero' }

The work for this robot is pretty straight-forward. Every second, we're going to
tell the Sphero to roll at speed `60`, in a random direction.

      work: (me) ->
        every 1.second(), ->
          me.sphero.roll 60, Math.floor(Math.random() * 360)

Simple enough. And with that done, we can now tell the robot to start working:

    .start()
