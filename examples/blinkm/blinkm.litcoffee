# BlinkM

For this example, we're going to use the `cylon-firmata` module to blink a light
using BlinkM.

Before we start, make sure you've got the `cylon-firmata` module installed.

First, let's import Cylon:

    Cylon = require '../..'

With Cylon imported, we can start defining our robot.

    Cylon.robot

Our robot will be using an Arduino, and communicating over the Firmata protocol:

      connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }

And we'll have one device, a BlinkM led.

      device: { name: 'blinkm', driver: 'blinkm' }

We'll now set up our robot's work.

      work: (my) ->

When the BlinkM sends the 'start' event, we'll set up our events

        my.blinkm.on 'start', ->

We'll request the BlinkM's version, and print that to the console:

          my.blinkm.version (version) ->
            console.log "Started BlinkM version #{version}"

By default, we'll turn the LED off and assign a boolean that we'll use to
determine if it's on or not:

          my.blinkm.off()
          lit = false

Now, every second, we'll toggle the LED, using the `lit` variable to determine
which state we need to transition the BlinkM to:

          every 1.second(), ->
            if lit
              lit = false
              console.log 'on'
              my.blinkm.rgb 0xaa, 0, 0
            else
              lit = true
              console.log 'off'
              my.blinkm.rgb 0, 0, 0

Now that our robot knows what to do, let's get started:

    .start()
