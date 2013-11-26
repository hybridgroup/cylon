Cylon = require '../..'

Cylon.robot
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }
  device: { name: 'led', driver: 'led', pin: 3 }

  work: (my) ->
    brightness = 0
    fade = 5

    every 0.05.seconds(), ->
      brightness += fade
      my.led.brightness(brightness)
      fade = -fade if (brightness is 0) or (brightness is 255)

.start()
