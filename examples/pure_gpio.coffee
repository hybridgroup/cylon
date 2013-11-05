DigitalPin = require('../dist/digital-pin')

pin4 = new DigitalPin(pin: 4)

pin4.on('create', (data) ->
  console.log("Pin files have been created")
)

pin4.on('open', (data) ->
  console.log("Pin ready for writing!")
  pin4.digitalWrite(1)
)

pin4.open()

