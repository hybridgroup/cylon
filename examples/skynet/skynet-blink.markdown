# Skynet Blink

First, let's import Cylon:

    var Cylon = require('../..');

Now that we have Cylon imported, we can start defining our robot

    Cylon.robot({

Let's define the connections and devices:

      connections: {
        arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' },

        skynet: {
          adaptor: 'skynet',
          uuid: "96630051-a3dc-11e3-8442-5bf31d98c912",
          token: "2s67o7ek98pycik98f43reqr90t6s9k9"
        }
      },

      devices: {
        led13: { driver: 'led', pin: 13, connection: 'arduino' } 
      },

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      work: function(my) {
        console.log("Skynet is listening");

        my.skynet.on('message', function(data) {
          data = JSON.parse(data);

          console.log(data);

          if (data.message.red === 'on') {
            my.led13.turnOn();
          } else {
            my.led13.turnOff();
          }
        });
      }

Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:

    }).start():
