spheron = require('spheron')

sphero = spheron.sphero()
spheroPort = '/dev/rfcomm0'

COLORS = spheron.toolbelt.COLORS

sphero.on 'open', ->
  console.log 'EVENT OPEN!'
  sphero.configureCollisionDetection 0x01, 0x20, 0x20, 0x20, 0x20, 0x50
  sphero.setRGB COLORS.GREEN, false

sphero.on 'close', -> console.log 'EVENT CLOSE!'
sphero.on 'end', -> console.log 'EVENT END!'
sphero.on 'error', -> console.log 'EVENT ERROR!'
sphero.on 'notification', (packet) -> console.log "Packet contents: #{packet}"
sphero.on 'message', (packet) -> console.log "Packet contents: #{packet}"

sphero.open spheroPort
