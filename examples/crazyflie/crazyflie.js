var Cylon = require('../..');

Cylon.robot({
  connections: {
    crazyflie: { adaptor: 'crazyflie', port: "radio://1/10/250KPS" }
  },

  devices: {
    drone: { driver: 'crazyflie' }
  }

  work: function(my) {
    my.drone.on('start', function() {
      my.drone.takeoff();
      after((10).seconds(), my.drone.land);
      after((15).seconds(), my.drone.stop);
    });
  }
}).start();
