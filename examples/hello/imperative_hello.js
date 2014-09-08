var Cylon = require('cylon');

var robot = new Cylon.Robot({
  connection: { name: 'loopback', adaptor: 'loopback' },
  device: { name: 'ping', driver: 'ping' },
});

setInterval(function() {
  console.log("Hello, human!")
  console.log(robot.ping.ping());
}, 1000);

setTimeout(function() {
  console.log("I've been at your command for 5 seconds now.")
}, 5000);
