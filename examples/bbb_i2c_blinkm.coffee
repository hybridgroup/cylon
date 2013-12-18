Cylon = require('..')

Cylon.robot
connection:
name: 'beaglebone', adaptor: 'beaglebone'

device:
name: 'pixel', driver: 'blinkm', pin: 'P9_20'

work: (my) ->
  # we do our thing here
  my.pixel.stopScript()
  my.pixel.goToRGB(255, 0, 0)

.start()
