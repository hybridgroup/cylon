Cylon = require('..')

cylon = Cylon.robot
  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  work: (me) ->
    every 1.second(), -> me.sphero.roll(60, Math.floor(Math.random() * 360), 1)

cylon.connections['sphero'].on('connected', ->
  console.log('CONNECTED EVENT TRIGGERED!')
)
cylon.start()
