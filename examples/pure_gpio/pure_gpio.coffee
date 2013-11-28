require '../../dist/digital-pin'

pin4 = new Cylon.IO.DigitalPin(pin: 4, mode: 'w')

pin4.on 'open', (data) -> console.log "Pin files have been created"

pin4.on 'digitalWrite', (value) ->
  console.log "Value written to pin: #{value}"

pin4.on 'connect', (data) ->
  console.log "Pin mode has been setup!"
  pin4.setHigh()

pin4.connect()
