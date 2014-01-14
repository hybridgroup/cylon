Cylon = require('../..')

Cylon.robot
  connection:
    name: 'opencv', adaptor: 'opencv'

  devices: [
    { name: 'window', driver: 'window' }
    {
      name: 'camera',
      driver: 'camera',
      camera: 1,
      haarcascade: "#{ __dirname }/examples/opencv/haarcascade_frontalface_alt.xml"
    } # Default camera is 0
  ]

  work: (my) ->
    my.camera.once('cameraReady', ->
      console.log('The camera is ready!')
      # We listen for frame ready event, when triggered
      # we display the frame/image passed as an argument
      # and we tell the window to wait 40 milliseconds
      my.camera.on('frameReady', (err, im) ->
        console.log("FRAMEREADY!")
        my.window.show(im, 40)
        #my.camera.readFrame()
      )
      # Here we have two options to start reading frames from
      # the camera feed.
      # 1. As fast as possible triggering the next frame read
      #    in the listener for frameReady, if you need video
      #    as smooth as possible uncomment #my.camera.readFrame()
      #    in the listener above and the one below this comment.
      #
      # my.camera.readFrame()
      #
      # 2. Use an interval of time to try and get aset amount
      #    of frames per second  (FPS), in the next example
      #    we are trying to get 1 frame every 50 milliseconds
      #    (20 FPS).
      #
      every 50, my.camera.readFrame
    )
.start()
