var cylon = require('..');

// Initialize the robot
var robot = cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'led', driver: 'led', pin: 13 },

  work: function() {
    robot = this

    // we do our thing here
    every((1).second(), function() { console.log(robot.led.name); });
  }
});

// start working
robot.start();
