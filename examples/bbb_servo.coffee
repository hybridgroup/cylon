Cylon = require '../..'

Cylon.robot
  connection: { name: 'beaglebone', adaptor: 'beaglebone' }
  device: { name: 'servo', driver: 'servo', pin: 'P9_14' }

  work: (my) ->

    angle = 30
    increment = 40

    every 1.seconds(), ->
      angle += increment
      my.servo.angle angle

      Logger.info "Current Angle: #{my.servo.currentAngle()}"

      increment = -increment if (angle is 30) or (angle is 150)

.start()
