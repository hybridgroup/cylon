# Cattoy

First, let's import Cylon:

    var Cylon = require('../..');

Now that we have Cylon imported, we can start defining our robot

    Cylon.robot({

Let's define the connections and devices:

      connections: {
        digispark: { adaptor: 'digispark' },
        leapmotion: { adaptor: 'leapmotion' }
      },

      devices: {
        servo1: { driver: 'servo', pin: 0, connection: 'digispark' },
        servo2: { driver: 'servo', pin: 1, connection: 'digispark' },
        leapmotion: { driver: 'leapmotion', connection: 'leapmotion' }
      },

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      work: function(my) {
        my.x = 90;
        my.z = 90;

        my.leapmotion.on('hand', function(hand) {
          my.x = hand.palmX.fromScale(-300, 300).toScale(30, 150);
          my.z = hand.palmZ.fromScale(-300, 300).toScale(30, 150);
        });

        every(100, function() {
          my.servo1.angle(my.x);
          my.servo2.angle(my.z);

          console.log("Current Angle: " + my.servo1.currentAngle() + ", " + my.servo2.currentAngle());
        });

Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:

    }).start()
