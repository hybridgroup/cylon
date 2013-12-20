Cylon = require('..')

# Initialize the robot
Cylon.robot
  connection: { name: 'beaglebone', adaptor: 'beaglebone' }
  device: { name: 'led', driver: 'led', pin: 'P9_14' }

  work: (my) ->
    # we do our thing here
    brightness = 0
    fade = 5
    every 0.05.seconds(), ->
      brightness += fade
      my.led.brightness(brightness)
      fade = -fade if (brightness is 0) or (brightness is 255)

.start()
