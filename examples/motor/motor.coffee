Cylon = require '../..'

Cylon.robot
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }
  device: { name: 'motor', driver: 'motor', pin: 3 }

  work: (my) ->
    speed = 0
    increment = 5

    every 0.05.seconds(), ->
      speed += increment
      my.motor.speed(speed)
      console.log "Current Speed: #{my.motor.currentSpeed() }"
      increment = -increment if (speed is 0) or (speed is 255)

.start()
