var Cylon = require('../..');

Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyUSB0' }
  },

  devices: {
    led: { driver: 'led', pin: 17 },
    servo: { driver: 'servo', pin: 2, range: { min: 30, max: 150 } }
  },

  work: function(my) {
    my.led.turnOn();

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
