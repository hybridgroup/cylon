Cylon = require('../..')

Cylon.robot
  connection:
    name: 'opencv', adaptor: 'opencv'

  devices: [
    { name: 'window', driver: 'window' }
    { name: 'camera', driver: 'camera', camera: 1 } # Default camera is 0
  ]

  work: (my) ->
    my.camera.on('cameraReady', ->
      console.log('The camera is ready!')
      # We listen for frame ready event, when triggered
      # we display the frame/image passed as an argument
      # and we tell the window to wait 5000 milliseconds
      my.camera.on('frameReady', (err, im) ->
        my.window.show(im, 5000)
      )
      my.camera.readFrame()
    )
.start()
