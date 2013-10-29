Cylon = require('..')

# Initialize the robot
Cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

  devices:
    [
      {name: 'sensor', driver: 'analogSensor', pin: 0, upperLimit: 900, lowerLimit: 100},
    ]

  work: (my) ->
    #my.sensor.on('analogRead', (val) ->
    #  console.log("AnalogValue ===> #{ val }")
    #)
    my.sensor.on('upperLimit', (val) ->
      console.log("Upper limit reached ===> #{ val }")
    )
    my.sensor.on('lowerLimit', (val) ->
      console.log("Lower limit reached ===> #{ val }")
    )
.start()
