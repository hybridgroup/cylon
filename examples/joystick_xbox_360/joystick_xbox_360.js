var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'joystick', adaptor: 'joystick', controller: 'xbox360' },
  device: { name: 'controller', driver: 'xbox360' },

  work: function(my) {
    ["a", "b", "x", "y"].forEach(function(button) {
      my.controller.on(button + ":press", function() {
        console.log("Button " + button + " pressed.");
      });

      my.controller.on(button + ":release", function() {
        console.log("Button " + button + " released.");
      });
    });

    var lastPosition = {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 }
    };

    my.controller.on("left:move", function(pos) {
      var last = lastPosition.left;
      if (!(pos.x === last.x && pos.y === last.y)) {
        console.log("Left Stick:", pos);
      }
    });

    my.controller.on("right:move", function(pos) {
      var last = lastPosition.right;
      if (!(pos.x === last.x && pos.y === last.y)) {
        console.log("Right Stick:", pos);
      }
    });
  }
});

Cylon.start();
