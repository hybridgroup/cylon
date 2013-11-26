var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'servo', driver: 'servo', pin: 3 },

  work: function(my) {
    var angle = 0;
    var increment = 90;

    every(1..seconds(), function() {
      angle += increment;
      my.servo.angle(angle);

      Logger.info("Current Angle: " + (my.servo.currentAngle()));

      if ((angle === 0) || (angle === 180)) { increment = -increment; }
    });
  }
}).start();
