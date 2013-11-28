# LED Brightness

For this example, we'll be using an LED on an Arduino board, and modifying it's
brightness to make it fade in and out. Before we start, make sure you've got the
`cylon-arduino` module installed.

Let's start by importing Cylon:

    Cylon = require '../..'

Once we've got that, we can start defining our robot:

    Cylon.robot

We'll be using an Arduino, and communicating over the Firmata protocol. As well,
we'll let our robot know about the LED we'll be modifying, on pin #3 of the
Arduino.

      connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }
      device: { name: 'led', driver: 'led', pin: 3 }

Next up, we'll define our robot's work:

      work: (my) ->

We'll set some variables here: brightness will represent the LED's brightness,
from 1-255, and 'fade' will be the brightness change on each tick.

        brightness = 0
        fade = 5

Every 50 milliseconds, we'll be incrementing the brightness by `fade`'s value,
setting the LED to that brightness, and reversing `fade`'s value if brightness
hits 0 or 255.

        every 0.05.seconds(), ->
          brightness += fade
          my.led.brightness(brightness)
          fade = -fade if (brightness is 0) or (brightness is 255)

And with that done, we can now start our robot.

    .start()
