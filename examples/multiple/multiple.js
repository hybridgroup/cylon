var bot, bots, robot, _i, _len;

var Cylon = require('../..');

bots = [
  { name: 'Huey' },
  { name: 'Dewey' },
  { name: 'Louie' }
];

var ChattyRobot = (function() {
  function ChattyRobot() {}

  ChattyRobot.prototype.connection = { name: 'loopback', adaptor: 'loopback' };
  ChattyRobot.prototype.device = { name: 'ping', driver: 'ping' };

  ChattyRobot.prototype.hello = function(my) {
    Logger.info("" + my.name + ": " + (my.ping.ping()));
  };

  ChattyRobot.prototype.work = function(my) {
    every((1).seconds(), function() {
      my.hello(my);
    });
  };

  return ChattyRobot;

})();

for (var i = 0; i < bots.length; i++) {
  var bot = bots[i];
  var robot = new ChattyRobot;

  robot.name = bot.name;

  Cylon.robot(robot);
}

Cylon.start();
