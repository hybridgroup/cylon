var Cylon = require("../..");

var Green = 0x0000FF,
    Red = 0xFF0000;

var bots = {
  'Thelma': '/dev/rfcomm0',
  'Louise': '/dev/rfcomm1',
  'Grace':  '/dev/rfcomm2',
  'Ada':    '/dev/rfcomm3'
};

Object.keys(bots).forEach(function(name) {
  var port = bots[name];

  var robot = Cylon.robot({ name: name, });

  robot.connection('sphero', { adaptor: 'sphero', port: port });
  robot.device('sphero', { driver: 'sphero' });

  robot.move = function() {
    robot.sphero.roll(60, Math.floor(Math.random() * 360));
  };

  robot.born = function() {
    robot.contacts = 0;
    robot.age = 0;
    robot.life();
    robot.move();
  };

  robot.life = function() {
    robot.alive = true;
    robot.sphero.setRGB(Green);
  };

  robot.death = function() {
    robot.alive = false;
    robot.sphero.setRGB(Red);
    robot.sphero.stop();
  };

  robot.enoughContacts = function() {
    return robot.contacts >= 2 && robot.contacts < 7;
  };

  robot.birthday = function() {
    robot.age += 1;

    if (robot.alive) {
      console.log("Happy birthday, " + robot.name + ". You are " + robot.age + " and had " + robot.contacts + " contacts.");
    }

    if (robot.enoughContacts()) {
      if (!robot.alive) {
        robot.born();
      }
    } else {
      robot.death();
    }

    robot.contacts = 0;
  };

  robot.on('ready', function() {
    robot.born();

    robot.sphero.on('collision', function() {
      robot.contacts += 1;
    });

    every((3).seconds(), function() {
      if (robot.alive) {
        robot.move();
      }
    });

    every((10).seconds(), function() {
      robot.birthday();
    });
  });
});

Cylon.start();
