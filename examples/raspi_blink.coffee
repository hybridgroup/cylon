Cylon = require('..')

# Initialize the robot
Cylon.robot
  connection:
    name: 'raspi', adaptor: 'raspi'

  device:
    name: 'led', driver: 'led', pin: 11

  work: (my) ->
    # we do our thing here
    every 1.second(), -> my.led.toggle()

.start()
