Cylon = require('..')

# Initialize the robot
Cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

  device:
    name: 'blinkm', driver: 'blinkm'

  work: (my) ->
    # we do our thing here
    my.blinkm.on 'start', ->
      Logger.info 'started...'
      my.blinkm.off()
      lit = false
      every 1.second(), ->
        if lit
          lit = false
          Logger.info 'on'
          my.blinkm.rgb 0xaa, 0, 0
        else
          lit = true
          Logger.info 'off'
          my.blinkm.rgb 0, 0, 0      

.start()
