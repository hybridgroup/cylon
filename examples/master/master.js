var Cylon = require('../..');

var bots = [ 'Huey', 'Dewey', 'Louie' ];

var MinionBot = (function() {
  function MinionBot() {}

  MinionBot.prototype.work = function(my) {
    console.log("Robot " + my.name + " is now working!");
  };

  return MinionBot;

})();

for (var i = 0; i < bots.length; i++) {
  var robot = new MinionBot;
  robot.name = bots[i];
  Cylon.robot(robot);
}

Cylon.start();
