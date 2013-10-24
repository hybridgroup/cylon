Cylon = require('..')

cylon = Cylon.robot
  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  work: (me) ->
    every 1.second(), -> me.sphero.roll(60, Math.floor(Math.random() * 360), 1)

console.log(cylon.devices['sphero'])

cylon.devices['sphero'].on('driver_load', ->
  console.log("DRIVER LOAD EVENT TRIGGERED!")
)
cylon.start()
