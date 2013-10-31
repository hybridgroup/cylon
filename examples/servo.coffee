Cylon = require('..')

# Initialize the robot
Cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

  device:
    name: 'servo', driver: 'servo', pin: 3

  work: (my) ->
    angle = 0
    increment = 90
    every 1.seconds(), ->
      angle += increment
      my.servo.angle(angle)
      console.log("Current Angle => #{ my.servo.currentAngle() }")
      increment = -increment if (angle is 0) or (angle is 180)

.start()
