require('../dist/digital-pin')

pin4 = new Cylon.IO.DigitalPin(pin: 4)

pin4.on('open', (data) ->
  console.log("Pin files have been created")
)

pin4.on('digitalWrite', (value) ->
  console.log("Value writen to pin -> #{ value }")
)

pin4.on('connect', (data) ->
  console.log("Pin mode has been setup!")
  pin4.digitalWrite(1)
)

pin4.open()

