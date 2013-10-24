var Cylon = require('..').instance();

// Initialize the robot
var robot = Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'led', driver: 'led', pin: 13 },

  work: function(self) {
    // we do our thing here
    console.log(self.led.name);
    every((1).second(), function() { console.log(self.led.name); });
  }
});

// start working
robot.start();
