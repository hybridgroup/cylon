# Leapmotion Arduino

First, let's import Cylon:

    var Cylon = require('../..');

Now that we have Cylon imported, we can start defining our robot

    Cylon.robot({

Let's define the connections and devices:

      connections: {
        leap: { adaptor: 'leapmotion' },
        arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
      },

      devices: {
        led: { driver: 'led', pin: 13, connection: 'arduino' }
      },

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      work: function(my) {
        my.leap.on('frame', function(frame) {
          if (frame.hands.length > 0) {
            my.led.turnOn();
          } else {
            my.led.turnOff();
          }
        });
      }

Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:

    }).start();
