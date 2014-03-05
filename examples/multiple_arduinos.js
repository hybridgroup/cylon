var Cylon = require('..'),
    arduino1, arduino2;

Arduino = (function(){
  function Arduino(){}

  Arduino.prototype.connection = { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' };

  Arduino.prototype.work = function(my) {
    console.log("Name =====>");
    console.log(my.name);
  }

  return Arduino;
})();

skynet = {
  connections: [
    { name: 'skynet',
      adaptor: 'skynet',
      uuid: "e8f942f1-a49c-11e3-9270-795e22e700d8", token: "0lpxpyafz7z7u8frgvp44g8mbr7o80k9" }
  ],

  work: function(my) {
    Logger.info("Skynet is listening...");

    my.skynet.on('message', function(data) {
      console.log(data);
      if (data.payload != null){
        var robot,
            robots = data.payload.robots;
        for(var index in robots){
          robot = robots[index];
          console.log(robot);
          my.master.findRobot(robot.name, function(err, bot){
            if (robot.cmd == 'on')
              bot.devices[robot.device].turnOn();
            else
              bot.devices[robot.device].turnOff();
          });
        }
      }
    });
  }
}
Cylon.robot(skynet);

arduino0 = new Arduino();
console.log(arduino0);
arduino0.name = 'arduino0';
arduino0.device = {name: 'led00', driver: 'led', pin: 13};
Cylon.robot(arduino0);

arduino1 = new Arduino();
arduino1.name = 'arduino1'
arduino1.connection.port = '/dev/ttyACM1';
arduino1.devices = [
  {name: 'led10', driver: 'led', pin: 11},
  {name: 'led11', driver: 'led', pin: 12},
  {name: 'led12', driver: 'led', pin: 13}
];
Cylon.robot(arduino1);

Cylon.start();
