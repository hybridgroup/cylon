Cylon = require('..')

Cylon.robot
connection:
name: 'beaglebone', adaptor: 'beaglebone'

device:
name: 'pixel', driver: 'blinkm', pin: 'P9_20'

work: (my) ->
  # we do our thing here
  my.pixel.stopScript()
  # You can pass a callback to all blinkm functions as the last param,
  # If you do the command would be executed asynchronously.
  # For write operations you get an (err) param passed back,
  # null/undefined for success, and containing the error y any encountered.
  #
  # Write BlimkM commands.
  my.pixel.goToRGB(255, 0, 0)
  my.pixel.fadeToRGB(0, 255, 0)
  my.pixel.fadeToHSB(100, 180, 90)
  my.pixel.fadeToRandomRGB(0, 0, 255)
  my.pixel.fadeToRandomHSB(100, 180, 90)
  my.pixel.playLightScript(1, 0, 0)
  my.pixel.stopScript()
  # For read commands you get (err, data) passed back to the callback,
  # data contains the read data buffer, in case of Sync call (no callback)
  # you get a regular return.
  my.pixel.getRGBColor()

.start()
