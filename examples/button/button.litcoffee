# Button

For this example, we're going to be connecting to an Arduino, and when a putton
on it's pressed, an LED will be toggled.

Before you start this example, make sure you've got the `cylon-firmata` module
installed.

We'll get started by importing the Cylon module:

    Cylon = require '../..'

Now that we have Cylon imported, let's start making our robot:

    Cylon.robot

Our robot will have a connection to an Arduino, and communicate with it via the
Firmata protocol:

      connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }

This time, our robot will have two devices, an LED and a button:

      devices: [
        { name: 'led', driver: 'led', pin: 13 },
        { name: 'button', driver: 'button', pin: 2 }
      ]

Our robot has very simple work, it will just toggle the LED whenever the button
sends the 'push' event:

      work: (my) ->
        my.button.on 'push', -> my.led.toggle()

And with all that done, we can start our robot:

    .start()
