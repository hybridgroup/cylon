var Cylon = require('cylon');

Cylon.robot({
  connections: {
    sphero: { adaptor: 'sphero', port: '/dev/tty.Sphero-YBW-RN-SPP' }
  },

  devices: {
    sphero: { driver: 'sphero' }
  },

  work: function(my) {
    var max = 0;
    var changingColor = false;

    my.sphero.setDataStreaming(['velocity'], { n: 40, m: 1, pcnt: 0 });
    my.sphero.on('data', function(data) {
      if(!changingColor) {
        x = Math.abs(data[0]);
        y = Math.abs(data[1]);

        if (x > max) max = x;
        if (y > max) max = y;
      }
    });

    every((0.6).second(), function() {
      changingColor = true;

      if (max < 10) {
        my.sphero.setColor('white');
      } else if (max < 100) {
        my.sphero.setColor('lightyellow');
      } else if (max < 150) {
        my.sphero.setColor('yellow');
      } else if (max < 250) {
        my.sphero.setColor('orange');
      } else if (max < 350) {
        my.sphero.setColor('orangered');
      } else if (max < 450) {
        my.sphero.setColor('red');
      } else {
        my.sphero.setColor('darkred');
      }

      max = 0;
      changingColor = false;
    });

  }
}).start();
