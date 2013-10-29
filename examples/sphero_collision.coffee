Cylon = require('..')

Cylon.robot
  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  work: (me) ->
    color = 0x00FF00
    bitFilter = 0xFFFF00

    me.sphero.on('connect', ->
      Logger.info('Setting up Collision Detection...')
      me.sphero.detectCollisions()
      me.sphero.setRGB(color)
    )

    me.sphero.on 'collision', (data) ->
      me.sphero.setRGB(color)
      Logger.info 'collision:'
      console.log("color: #{ parseInt(color, 16) } ")
      color = color ^ bitFilter
      me.sphero.roll 60, Math.floor(Math.random() * 360)

    every 1.second, ->
      me.sphero.roll 90, Math.floor(Math.random() * 360)

.start()
