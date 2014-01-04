var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'servo', driver: 'servo', pin: 3 },

  work: function(my) {
    var angle = 30;
    var increment = 40;

    every(1..seconds(), function() {
      angle += increment;
      my.servo.angle(angle);

      console.log("Current Angle: " + (my.servo.currentAngle()));

      if ((angle === 30) || (angle === 150)) { increment = -increment; }
    });
  }
}).start();
