Cylon = require('..')

# Initialize the robot
Cylon.robot
  connection:
    name: 'raspi', adaptor: 'raspi'

  devices:
    [
      {name: 'led', driver: 'led', pin: 13},
      {name: 'button', driver: 'button', pin: 2}
    ]

  work: (my) ->
    my.button.on 'push', -> my.led.toggle()

.start()
