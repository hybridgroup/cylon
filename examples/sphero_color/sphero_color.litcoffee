# Sphero Color

This Cylon example will connect to a Sphero, and change it's color randomly
every second. Before we start, ensure you've got the `cylon-sphero` module
installed.

To get started, let's import the Cylon module:

    Cylon = require '../..'

Now we can start defining our robot.

    Cylon.robot

Our robot will have, as with other Sphero examples, one connection and one
device, both to the same Sphero.

      connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' }
      device: { name: 'sphero', driver: 'sphero' }

The work our robot will be performing is fairly, straightforward, it will just
be changing it's color to a random new color every second.

      work: (my) ->
        every 1.second(), ->
          my.sphero.setRGB Math.floor(Math.random() * 100000)

And with the pieces in place, we can start our robot!

    .start()
