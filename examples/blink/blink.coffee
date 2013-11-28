Cylon = require '../..'

# Initialize the robot
Cylon.robot
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }

  device: { name: 'led', driver: 'led', pin: 13 }

  work: (my) ->
    every 1.second(), -> my.led.toggle()

.start()
