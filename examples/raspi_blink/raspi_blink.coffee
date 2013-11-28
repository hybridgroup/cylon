Cylon = require '../..'

Cylon.robot
  connection: { name: 'raspi', adaptor: 'raspi' }
  device: { name: 'led', driver: 'led', pin: 11 }

  work: (my) ->
    every 1.second(), -> my.led.toggle()

.start()
