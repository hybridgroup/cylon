var Cylon = require('../..');

Cylon.robot({
  connection: {
    name: 'crazyflie',
    adaptor: 'crazyflie',
    port: "radio://1/10/250KPS"
  },

  device: {
    name: 'drone',
    driver: 'crazyflie'
  },

  work: function(my) {
    my.drone.on('start', function() {
      my.drone.takeoff();
      after(10..seconds(), function() { my.drone.land(); });
      after(15..seconds(), function() { my.drone.stop(); });
    });
  }
}).start();
