Cylon = require '../..'

# Initialize the robot
Cylon.robot
  connection: { name: 'digispark', adaptor: 'digispark'}

  device: { name: 'led', driver: 'led', pin: 1 }

  work: (my) ->

    every 1.second(), -> my.led.toggle()

.start()
