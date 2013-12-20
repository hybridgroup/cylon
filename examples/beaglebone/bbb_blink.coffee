Cylon = require('..')

# Initialize the robot
Cylon.robot
  connection:
    name: 'beaglebone', adaptor: 'beaglebone'

  device:
    name: 'led', driver: 'led', pin: 'P9_12'

  work: (my) ->
    # we do our thing here
    every 1.second(), -> my.led.toggle()

.start()
