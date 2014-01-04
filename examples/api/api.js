var Cylon = require('../..');

Cylon.api({ host: '0.0.0.0', port: '8080' });

var bots = [
  { port: '/dev/rfcomm0', name: 'Thelma' },
  { port: '/dev/rfcomm1', name: 'Louise' }
];

var SpheroRobot = {
  connection: { name: 'Sphero', adaptor: 'sphero' },

  device: { name: 'sphero', driver: 'sphero' },

  work: function(my) {
    every((1).seconds(), function() {
      console.log(my.name);
      my.sphero.setRandomColor();
      my.sphero.roll(60, Math.floor(Math.random() * 360));
    });
  }
};

for (var i = 0; i < bots.length; i++) {
  var bot = bots[i];
  var robot = Object.create(SpheroRobot);

  robot.connection.port = bot.port;
  robot.name = bot.name;

  Cylon.robot(robot);
}

Cylon.start();
