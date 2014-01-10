# Motor

For this example, similar in structure to the led_brightness example, we're
going to take an Arduino, and modify the speed of an attached motor such that it
continually speeds up and slows down.

Before we get started, make sure to have the `cylon-arduino` module installed.

First, let's require Cylon:

    Cylon = require '../..'

Now we can start defining our robot:

    Cylon.robot

We'll be connecting to an Ardunio, using the Firmata protocol, and a motor
attached to the Arduino on pin 3.

      connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }
      device: { name: 'motor', driver: 'motor', pin: 3 }

We'll start defining the work for our robot next:

      work: (my) ->

We'll define variables to hold our motor's speed, and the rate at which that
speed will change:

        speed = 0
        increment = 5

Every fifty milliseconds, we'll increment the `speed`, set the motor to run at
that speed, and log the speed we're running at to the console. We'll also make
sure to change the increment if the speed is at the upper/lower bounds of the
values supported:

        every 0.05.seconds(), ->
          speed += increment
          my.motor.speed(speed)
          console.log "Current Speed: #{my.motor.currentSpeed() }"
          increment = -increment if (speed is 0) or (speed is 255)

And with all that done, we can now start our robot:

    .start()
