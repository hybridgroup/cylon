Cylon = require('../..')

Cylon.robot
  connection:
    name: 'raspi', adaptor: 'raspi'

  device:
    name: 'pixel', driver: 'blinkm'

  work: (my) ->

    # Before you can use and work with I2C in the raspberry pi you
    # need to configure it, follow the instructions to enable it here:
    #
    # http://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c

    # We first stop the BlinkM light script
    my.pixel.stopScript()

    # You can pass a callback to all blinkm functions as the last param,
    # If you do the command would be executed asynchronously.
    # For write operations you get an (err) param passed back,
    # null/undefined for success, and containing the error y any encountered.

    # BlimkM  Write Commands.
    my.pixel.goToRGB(255, 0, 0)
    my.pixel.fadeToRGB(0, 255, 0)
    my.pixel.fadeToRGB(0, 0, 255)
    #my.pixel.fadeToHSB(100, 180, 90)
    #my.pixel.fadeToRandomRGB(0, 0, 255)
    #my.pixel.fadeToRandomHSB(100, 180, 90)
    #my.pixel.playLightScript(1, 0, 0)
    #my.pixel.stopScript()
    #my.pixel.setFadeSpeed(50)
    #my.pixel.setTimeAdjust(50)

    # For read commands you get (err, data) passed back to the callback,
    # data contains the read data buffer, in case of Sync call (no callback)
    # you get a regular return with the data buffer.
    color = my.pixel.getRGBColor()
    console.log(color)

    # Example getting the color usinc async call and a callback
    my.pixel.getRGBColor((err, data) ->
      console.log(data) unless err?
    )

.start()
