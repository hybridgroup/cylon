# Raspberry Pi - Servo

For this example, similar in structure to the led_brightness example, we're
going to take a Raspberry Pi, and modify the angle of an attached servo such
that it's continually turning back and forth.

Before we get started, make sure to have the `cylon-raspi` module installed.

First, let's require Cylon:

    Cylon = require '../..'

Now we can start defining our robot:

    Cylon.robot

We'll be connecting to an Raspberry Pi, and using a servo attached to the
Raspberry Pi on pin 11.

      connection: { name: 'raspi', adaptor: 'raspi', port: '/dev/ttyACM0' }
      device: { name: 'servo', driver: 'servo', pin: 11 }

We'll start defining the work for our robot next:

      work: (my) ->

We'll define variables to hold our servo's angle, and the rate at which that
angle will change:

        angle = 30
        increment = 40

Every second, we'll increment the `angle`, set the servo to run at that angle,
and log the angle we're running at to the console. We'll also make sure to
change the increment if the angle is at the upper/lower bounds of the values
supported:

        every 1.seconds(), ->
          angle += increment
          my.servo.angle(angle)

          console.log "Current angle: #{my.servo.currentAngle() }"

          increment = -increment if (angle is 30) or (angle is 150)

And with all that done, we can now start our robot:

    .start()
