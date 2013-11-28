var Cylon = require('../..');

Cylon.robot({
  connection: { name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1' },
  device: { name: 'drone', driver: 'ardrone' },

  work: function(my) {
    my.drone.takeoff();
    after(10..seconds(), function() { my.drone.land(); });
    after(15..seconds(), function() { my.drone.stop(); });
  }
}).start();
