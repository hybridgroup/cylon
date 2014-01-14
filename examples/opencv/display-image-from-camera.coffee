Cylon = require('../..')

Cylon.robot
  connection:
    name: 'opencv', adaptor: 'opencv'

  devices: [
    { name: 'window', driver: 'window' }
    { name: 'camera', driver: 'camera', camera: 1 }
  ]

  work: (my) ->
    my.camera.on('cameraReady', ->
      console.log('THE CAMERA IS READY!')
      my.camera.on('frameReady', (err, im) ->
        my.window.show(im, 5000)
      )
      my.camera.readFrame()
    )
.start()
