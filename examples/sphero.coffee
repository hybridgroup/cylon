Cylon = require('..')

Cylon.robot
  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  work: (me) ->

    me.sphero.on 'message', (data) ->
      Logger.info 'message:'
      Logger.info data

    me.sphero.on 'notification', (data) ->
      Logger.info 'notification:'
      Logger.info data

    me.sphero.configureCollisionDetection()

.start()
