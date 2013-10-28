Cylon = require('..')

# Initialize the robot
Cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

  devices:
    [
      {name: 'led', driver: 'led', pin: 13},
      {name: 'button', driver: 'button', pin: 2}
    ]

  work: (my) ->
    # we do our thing here
    my.button.on 'pushed', -> my.led.toggle()
    #my.button.on 'released', -> Logger.info 'ho'
.start()
