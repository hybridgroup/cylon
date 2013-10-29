Cylon = require('..')

Cylon.robot
  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  work: (me) ->

    me.sphero.on('connect', ->
      Logger.info('Setting up Collision Detection...')
      me.sphero.detectCollisions()
      me.sphero.setRGB(0x00FF00)
    )

    me.sphero.on 'message', (data) ->
      me.sphero.setRGB(0x0000FF)
      Logger.info 'message:'
      Logger.info data

    me.sphero.on 'collision', (data) ->
      me.sphero.setRGB(0xFF0000)
      Logger.info 'collision:'
      Logger.info data

    me.sphero.on 'notification', (data) ->
      me.sphero.setRGB(0xFF0000)
      Logger.info 'notification:'
      Logger.info data

.start()
