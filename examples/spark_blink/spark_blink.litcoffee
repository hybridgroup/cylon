# Spark - Blink

For this example, we're going to connect to a Spark Core and make the LED on
pin D7 blink on a 1-second interval. Before we start, make sure you've got the
`cylon-spark` module installed.

First, let's make sure to load the Cylon module:

    Cylon = require '../..'

After we've got that done, we can start defining our robot:

    Cylon.robot

We'll have a singular connection to a Spark Core, using the
previously-mentioned `cylon-spark` module. We'll also have one device, the LED
on pin D7.

      connection:
        name: 'spark', adaptor: 'spark', deviceId: '', accessToken: ''

      device:
        name: 'led', driver: 'led', pin: 'D7'

Those are all the components for our robot, so next we'll define the work. All
we're going to do for this example is tell the LED to toggle every second.

      work: (my) ->
        every 1.second(), -> my.led.toggle()

And with all those pieces in place, we can tell the robot to get started:

    .start()
