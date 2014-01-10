Cylon = require '../..'

Cylon.robot
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' }
  device: { name: 'sphero', driver: 'sphero' }

  work: (me) ->
    color = 0x00FF00
    bitFilter = 0xFFFF00

    me.sphero.on 'connect', ->
      console.log "Setting up Collision Detection..."
      me.sphero.detectCollisions()
      me.sphero.setRGB color
      me.sphero.stop()

    me.sphero.on 'collision', (data) ->
      console.log "Collision:"
      color = color ^ bitFilter
      console.log "Color: #{color.toString(16)} "
      me.sphero.setRGB color
      me.sphero.roll 90, Math.floor(Math.random() * 360)

.start()
