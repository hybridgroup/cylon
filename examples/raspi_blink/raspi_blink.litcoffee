# Raspberry Pi - Blink

For this example, we're going to connect to a Raspberry Pi and make the LED on
pin 11 blink on a 1-second interval. Before we start, make sure you've got the
`cylon-raspi` module installed.

First, let's make sure to load the Cylon module:

    Cylon = require '../..'

After we've got that done, we can start defining our robot:

    Cylon.robot

We'll have a singular connection to a Raspberry Pi, using the
previously-mentioned `cylon-raspi` module. We'll also have one device, the LED
on pin 11.

      connection: { name: 'raspi', adaptor: 'raspi' }
      device: { name: 'led', driver: 'led', pin: 11 }

Those are all the components for our robot, so next we'll define the work. All
we're going to do for this example is tell the LED to toggle every second.

      work: (my) ->
        every 1.second(), -> my.led.toggle()

And with all those pieces in place, we can tell the robot to get started:

    .start()
