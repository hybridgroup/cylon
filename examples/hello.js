var cylon = require('..');

// Initialize the robot
var robot = cylon.robot({
  work: function() {
    every((1).second(), function() { Logger.info("hello, human!"); });
  }
});

// start working
robot.start();
