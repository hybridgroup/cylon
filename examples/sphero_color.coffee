Cylon = require('..')

Cylon.robot
  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  work: (me) ->
    me.nextColor = ->
      @color ?= 0x000050
      @color += 0x005000
      @color = 0x000050 if @color > 0xFFFFFF
      @color

    every 1.second(), ->
      me.sphero.setRGB me.nextColor()

.start()
