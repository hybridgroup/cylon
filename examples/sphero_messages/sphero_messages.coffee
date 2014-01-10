Cylon = require '../..'

Cylon.robot
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' }
  device: { name: 'sphero', driver: 'sphero' }

  work: (me) ->
    me.sphero.on 'connect', ->
      console.log "Setting up Collision Detection..."
      me.sphero.detectCollisions()
      me.sphero.setRGB 0x00FF00

    me.sphero.on 'update', (data) ->
      console.log "Update event eventName: #{data} "
      console.log "Update event args: "
      console.log data

    me.sphero.on 'message', (data) ->
      me.sphero.setRGB 0x0000FF
      console.log "Message:"
      console.log data

    me.sphero.on 'collision', (data) ->
      me.sphero.setRGB 0xFF0000
      console.log "Collision:"
      console.log data

    me.sphero.on 'notification', (data) ->
      me.sphero.setRGB 0xFF0000
      console.log "Notification:"
      console.log data

.start()
