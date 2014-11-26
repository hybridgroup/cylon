# Keyboard

For this Cylon example, we're going to quickly demonstrate getting keyboard
input.

First, let's import Cylon:

    var Cylon = require('../..');

With that done, let's define our robot:

    Cylon.robot({

It will have a single connection and device, both to the keyboard.

      connections: {
        keyboard: { adaptor: 'keyboard' }
      },

      devices: {
        keyboard: { driver: 'keyboard' }
      },

When we tell this robot to work, it's going to listen to the 'a' key on the
keyboard and let us know when it's been pressed.

      work: function(my) {
        my.keyboard.on('a', function(key) {
          console.log("a pressed!")
        });
      }

With that done, let's get started!

    }).start();
