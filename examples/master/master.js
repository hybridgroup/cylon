var Cylon = require('../..');

var bots = [ 'Huey', 'Dewey', 'Louie' ];

bots.forEach(function(name) {
  Cylon.robot({
    name: name,

    work: function(my) {
      console.log("Robot " + my.name + " is now working!");
    }
  });
});

Cylon.start();
