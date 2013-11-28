# Raspberry Pi - Button

For this example, we're going to toggle a LED every time a button is pressed.
Both of these devices will be hooked up to a Raspberry Pi.

Before you get started, make sure you have the `cylon-raspi` module installed.

First, let's import Cylon:

    Cylon = require '../..'

With Cylon imported, we can now start defining our robot.

    Cylon.robot

Our robot has one connection, to the Raspberry Pi the hardware will be running
on. For hardware, we're keeping it simple. A LED on pin 11, and a button on pin
7.

      connection: { name: 'raspi', adaptor: 'raspi' }

      devices: [
        {name: 'led', driver: 'led', pin: 11},
        {name: 'button', driver: 'button', pin: 7}
      ]

With the hardware defined, we can get to the work our robot will perform. And as
you can see, it's enormously complex:

      work: (my) ->
        my.button.on 'push', -> my.led.toggle()

Essentially, when the robot's button emits the 'push' event (when it's pressed),
the LED will be told to toggle.

And voila! We now have a basic light switch. All we need to do now is tell the
robot to start:

    .start()
