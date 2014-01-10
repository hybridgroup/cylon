Cylon = require '../..'

Cylon.robot
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }

  device: { name: 'blinkm', driver: 'blinkm' }

  work: (my) ->
    my.blinkm.on 'start', ->
      my.blinkm.version (version) ->
        console.log "Started BlinkM version #{version}"

      my.blinkm.off()
      lit = false

      every 1.second(), ->
        if lit
          lit = false
          console.log 'on'
          my.blinkm.rgb 0xaa, 0, 0
        else
          lit = true
          console.log 'off'
          my.blinkm.rgb 0, 0, 0

.start()
