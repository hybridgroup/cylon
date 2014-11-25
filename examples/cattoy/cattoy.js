var Cylon = require('../..');

Cylon.robot({
  connections: {
    digispark: { adaptor: 'digispark' },
    leapmotion: { adaptor: 'leapmotion' }
  },

  devices: {
    servo1: { driver: 'servo', pin: 0, connection: 'digispark' },
    servo2: { driver: 'servo', pin: 1, connection: 'digispark' },
    leapmotion: { driver: 'leapmotion', connection: 'leapmotion' }
  },

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
  }
}).start();
