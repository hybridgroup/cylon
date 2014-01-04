var Cylon = require('../..');

Cylon.robot({
  connection: {
    name: 'arduino',
    adaptor: 'firmata',
    port: '/dev/ttyACM0'
  },

  device: {
    name: 'sensor',
    driver: 'analogSensor',
    pin: 0,
    upperLimit: 900,
    lowerLimit: 100
  },

  work: function(my) {
    my.sensor.on('upperLimit', function(val) {
      console.log("Upper limit reached ===> " + val);
    });

    my.sensor.on('lowerLimit', function(val) {
      console.log("Lower limit reached ===> " + val);
    });
  }

}).start();
