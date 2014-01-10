Cylon = require '..'

Cylon.robot
  connection: { name: 'beaglebone', adaptor: 'beaglebone' }
  device: { name: 'servo', driver: 'servo', pin: 'P9_14' }

  work: (my) ->

    # Be carefull with your servo angles or you might DAMAGE the servo!
    # Cylon uses a 50hz/s (20ms period) frequency and a Duty Cycle
    # of 0.5ms to 2.5ms to control the servo angle movement.
    #
    # This means:
    # 1. 0.5ms == 0 degrees
    # 2. 1.5ms == 90 degrees
    # 3. 2.5ms == 180 degrees
    # (It is usually safe to start with a 90 degree angle, 1.5ms duty
    # cycle in most servos)
    #
    # Please review your servo datasheet to make sure of correct
    # angle range and the Freq/MS Duty cycle it requires.
    # If more servo support is needed leave us a comment, raise an
    # issue or help us add more support.
    angle = 30
    increment = 40

    every 1.seconds(), ->
      angle += increment
      my.servo.angle angle

      console.log "Current Angle: #{my.servo.currentAngle()}"

      increment = -increment if (angle is 30) or (angle is 150)

.start()
