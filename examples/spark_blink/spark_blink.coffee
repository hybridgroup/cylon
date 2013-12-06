Cylon = require '../..'

Cylon.robot
  connection:
    name: 'spark', adaptor: 'spark', deviceId: '', accessToken: ''

  device:
    name: 'led', driver: 'led', pin: 'D7'

  work: (my) ->
    every 1.second(), -> my.led.toggle()

.start()
