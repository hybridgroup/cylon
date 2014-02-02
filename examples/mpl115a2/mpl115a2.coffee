Cylon = require '../..'

Cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

  device:
    name: 'mpl115a2', driver: 'mpl115a2'

  work: (my) ->
    my.mpl115a2.on 'start', ->
      my.mpl115a2.getTemperature((data) ->
        Logger.info "temperature #{data['temperature']}, pressure #{data['pressure']}"
      )

.start()
