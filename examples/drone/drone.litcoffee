# Drone

For a very simple drone demo, we're going to use Cylon to make an ARDrone take
off, hover, and land. Before you get started, make sure you have the
`cylon-ardrone` module installed.

First, we need to load up Cylon.

    Cylon = require '../..'

And now that we have that taken care of, we can define our robot.

    Cylon.robot

Our robot will communicate with an ARDrone over an IP address, and controls the
drone using a device we're going to call "drone":

      connection: { name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1' }
      device: { name: 'drone', driver: 'ardrone' }

The work for this robot is pretty straightforward. It's going to take off, and
then land after ten seconds. Five seconds later, after it's safely on the
ground, it will fully stop.

      work: (my) ->
        my.drone.takeoff()
        after 10.seconds(), -> my.drone.land()
        after 15.seconds(), -> my.drone.stop()

Simple as can be. And now that we've got all that set up, we can get started!

    .start()
