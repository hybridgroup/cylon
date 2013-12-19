Cylon = require('..')

# Initialize the robot
Cylon.robot
  connection:
    name: 'beaglebone', adaptor: 'beaglebone'

  devices:
    [
      {name: 'led', driver: 'led', pin: 'P9_12'},
      {name: 'button', driver: 'button', pin: 'P9_14'}
    ]

  work: (my) ->
    my.button.on 'push', () -> my.led.toggle()

.start()
