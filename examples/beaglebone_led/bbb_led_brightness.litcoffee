# Beaglebone Led Brightness

First, let's import Cylon:  

    Cylon = require('../..')

Now that we have Cylon imported, we can start defining our robot

    # Initialize the robot
    Cylon.robot

Let's define the connections and devices:

      connection: { name: 'beaglebone', adaptor: 'beaglebone' }
      device: { name: 'led', driver: 'led', pin: 'P9_14' }

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      work: (my) ->
        # we do our thing here
        brightness = 0
        fade = 5
        every 0.05.seconds(), ->
          brightness += fade
          my.led.brightness(brightness)
          fade = -fade if (brightness is 0) or (brightness is 255)

Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:

    .start()
