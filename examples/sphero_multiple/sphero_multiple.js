var Cylon = require('../..');

var SpheroRobot = (function() {
  function SpheroRobot() {}

  SpheroRobot.prototype.connection = { name: 'Sphero', adaptor: 'sphero' };
  SpheroRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

  SpheroRobot.prototype.work = function(my) {
    every((1).second(), function() {
      console.log(my.name);
      my.sphero.setRandomColor();
      my.sphero.roll(60, Math.floor(Math.random() * 360));
    });
  };

  return SpheroRobot;
})();

var bots = [
  { name: "Thelma", port: "/dev/rfcomm0" },
  { name: "Louise", port: "/dev/rfcomm1" }
];

for (var i = 0; i < bots.length; i++) {
  var bot = bots[i];
  var robot = new SpheroRobot;

  robot.name = bot.name;
  robot.connection.port = bot.port;

  Cylon.robot(robot);
}

Cylon.start();
