# Pure GPIO

Here we'll demonstrate an example of controlling a digital pin using a pure GPIO
interface.

First, we need to require the `digital-pin` class inside of Cylon:

    require '../../dist/digital-pin'

Then we'll instantiate a new instance of it, with write permissions and using
pin 4.

    pin4 = new Cylon.IO.DigitalPin(pin: 4, mode: 'w')

Once the pin's been opened, we'll write to the console to indicate so:

    pin4.on 'open', (data) ->
      console.log "Pin files have been created"

And on the 'digitalWrite' event for the pin, we'll log the value that's been
written:

    pin4.on 'digitalWrite', (value) ->
      console.log "Value written to pin: #{value}"

When the pin's been connected, we'll set it to high (1)

    pin4.on 'connect', (data) ->
      console.log "Pin mode has been setup!"
      pin4.setHigh()

And with all our events defined, we'll connect the pin:

    pin4.connect()
