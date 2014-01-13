Cylon = require '../..'

Cylon.robot
  device: { name: 'keyboard', driver: 'keyboard' }
  connection: { name: 'keyboard', adaptor: 'keyboard' }
  work: (my) ->
    my.keyboard.on 'a', (key) ->
      console.log "A PRESSED!"

.start()