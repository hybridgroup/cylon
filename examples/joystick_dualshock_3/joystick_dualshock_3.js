var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'joystick', adaptor: 'joystick', controller: 'dualshock3' },
  device: { name: 'controller', driver: 'dualshock3' },

  work: function(my) {
    ["square", "circle", "x", "triangle"].forEach(function(button) {
      my.controller.on(button + ":press", function() {
        console.log("Button " + button + " pressed.");
      });

      my.controller.on(button + ":release", function() {
        console.log("Button " + button + " released.");
      });
    });

    my.controller.on("left:move", function(pos) {
      console.log("Left Stick:", pos);
    });

    my.controller.on("right:move", function(pos) {
      console.log("Right Stick:", pos);
    });
  }
});

Cylon.start();
