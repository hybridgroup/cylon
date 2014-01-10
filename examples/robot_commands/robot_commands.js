var Cylon = require('../..');

Cylon.api({ host: '0.0.0.0', port: '8080' });

var MyRobot = (function() {
  function MyRobot() {}

  MyRobot.prototype.commands = ["relax"];

  MyRobot.prototype.relax = function() {
    return "" + this.name + " says relax";
  };

  MyRobot.prototype.work = function(me) {
    every((1).seconds(), function() {
      console.log(me.name);
    });
  };

  return MyRobot;

})();

var robot = new MyRobot;
robot.name = "frankie";

Cylon.robot(robot);

Cylon.start();
