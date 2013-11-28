# Blink

For this very basic Cylon example, we're just going to hook up to an Arduino and
blink an LED on it with a one-second interval.

To get started, let's load up Cylon:

    Cylon = require '../..'

With Cylon loaded, we can now define our basic robot.

    Cylon.robot

Our robot has one connection, to an Arduino using the `cylon-firmata` adaptor:

      connection: { name: "arduino", adaptor: "firmata", port: "/dev/ttyACM0" }

Our robot also only has one device (or at least only one we're concerned about),
an LED on pin 13.

      device: { name: 'led', driver: 'led', pin: 13 }

Next, we'll define the robot's work, which will be toggling the LED every
second:

      work: (my) ->
        every 1.second(), -> my.led.toggle()

And that's all the parts of our robot. All that's left is to start it.

    .start()
