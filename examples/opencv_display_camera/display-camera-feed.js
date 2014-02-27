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
      camera: 0,
      haarcascade: "" + __dirname + "/examples/opencv/haarcascade_frontalface_alt.xml"
    }
  ],
  work: function(my) {
    return my.camera.once('cameraReady', function() {
      console.log('The camera is ready!');
      my.camera.on('frameReady', function(err, im) {
        console.log("FRAMEREADY!");
        return my.window.show(im, 40);
      });
      return every(50, my.camera.readFrame);
    });
  }
}).start();
