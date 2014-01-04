var Cylon = require('../..');

var bots = [
  { port: '/dev/cu.Sphero-RGB', name: 'Huey' },
  { port: '/dev/cu.Sphero-GRB', name: 'Dewey' },
  { port: '/dev/cu.Sphero-BRG', name: 'Louie' }
];

var SpheroRobot = (function() {
  function SpheroRobot() {}

  SpheroRobot.prototype.connection = { name: 'Sphero', adaptor: 'sphero' };

  SpheroRobot.prototype.work = function(my) {
    console.log("Robot " + my.name + " is now working!");
  };

  return SpheroRobot;

})();

for (var i = 0; i < bots.length; i++) {
  var bot = bots[i];
  var robot = new SpheroRobot;

  robot.connection.port = bot.port;
  robot.name = bot.name;

  Cylon.robot(robot);
}

Cylon.start();
