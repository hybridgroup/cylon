# Leapmotion Arduino

First, let's import Cylon:

    Cylon = require '../..'
     
Now that we have Cylon imported, we can start defining our robot

    Cylon.robot

Let's define the connections and devices:

      connections: [
        { name: 'leapmotion', adaptor: 'leapmotion', port: '127.0.0.1:6437' },
        { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }
      ]
     
      devices: [
        { name: 'leapmotion', driver: 'leapmotion', connection: 'leapmotion' },
        { name: 'led', driver: 'led', pin: 13, connection: 'arduino' }
      ]

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      work: (my) ->
        my.leapmotion.on 'frame', (frame) ->
          if (frame.hands.length > 0) then my.led.turnOn() else my.led.turnOff()

Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:
     
    .start()
