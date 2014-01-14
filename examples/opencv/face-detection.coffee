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
      haarcascade: "#{ __dirname }/haarcascade_frontalface_alt.xml"
    } # Default camera is 0
  ]

  work: (my) ->
    # We setup our face detection once the camera is ready to
    # siplays images, we used once to make sure the event listeners
    # are only registered once.
    my.camera.once('cameraReady', ->
      console.log('The camera is ready!')
      # We add a listener for the facesDetected event
      # here we will get (err, image/frame, faces) params.
      # The faces param is an array conaining any face detected
      # in the frame (im).
      my.camera.on('facesDetected', (err, im, faces) ->
        # We loop trhough the faces and manipulate the image
        # to display a square in the coordinates for the detected
        # faces.
        for face in faces
          im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], [0,255,0], 2)
        # Once the image has been updated with rectangles around
        # detected faces we display it in our window.
        my.window.show(im, 40)

        # After displaying the updated image we trigger another
        # frame read to ensure the fastest processing possible.
        # We could also use an interval to try and get a set
        # amount of processed frames per second, see below.
        my.camera.readFrame()
      )
      # We listen for frameReady event, when triggered
      # we start the face detection passsing the frame
      # that we jsut got.
      my.camera.on('frameReady', (err, im) ->
        my.camera.detectFaces(im)
      )

      # Here we could also try to get a set amount of processed FPS
      # by setting an interval and reading frames every set amount
      # of time. We could just uncomment the next line and commenting
      # out the my.camera.readFrame() in the facesDetected listener
      # as well as the one two lines below.
      #every 150, my.camera.readFrame
      my.camera.readFrame()
    )
.start()
