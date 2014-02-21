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
      camera: 1,
      haarcascade: "" + __dirname + "/haarcascade_frontalface_alt.xml"
    }
  ],
  work: function(my) {
    return my.camera.once('cameraReady', function() {
      console.log('The camera is ready!');
      my.camera.on('facesDetected', function(err, im, faces) {
        var face, _i, _len;
        for (_i = 0, _len = faces.length; _i < _len; _i++) {
          face = faces[_i];
          im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], [0, 255, 0], 2);
        }
        my.window.show(im, 40);
        return my.camera.readFrame();
      });
      my.camera.on('frameReady', function(err, im) {
        return my.camera.detectFaces(im);
      });
      return my.camera.readFrame();
    });
  }
}).start();