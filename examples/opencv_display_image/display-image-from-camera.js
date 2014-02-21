var Cylon = require('../..');

Cylon.robot({
  connection: {
    name: 'opencv',
    adaptor: 'opencv'
  },
  devices: [
    {
      name: 'window',
      driver: 'window'
    }, {
      name: 'camera',
      driver: 'camera',
      camera: 1
    }
  ],
  work: function(my) {
    return my.camera.on('cameraReady', function() {
      console.log('THE CAMERA IS READY!');
      my.camera.on('frameReady', function(err, im) {
        return my.window.show(im, 5000);
      });
      return my.camera.readFrame();
    });
  }
}).start();