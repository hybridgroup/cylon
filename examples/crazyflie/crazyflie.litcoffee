# Crazyflie

For this Cylon demo, we're going to connect to a Crazyflie, and then make it
take off and land. Before we get started, make sure you've got the
`cylon-crazyflie` adaptor installed.

To start us off, let's import Cylon:

    Cylon = require '../..'

Now that we've got that set up, we can start defining our robot:

    Cylon.robot

We'll be using one connection and one device for this robot, both using the
crazyflie adaptor. We'll be connecting to the Crazyflie using the CrazyRadio.

      connection:
        name: 'crazyflie', adaptor: 'crazyflie', port: "radio://1/10/250KPS"

      device:
        name: 'drone', driver: 'crazyflie'

With the parts in place, we can start defining our robot's work.

      work: (my) ->

When our drone is ready, we'll make it takeoff. After ten seconds, we'll tell it
to land, and five seconds after that to stop.

        my.drone.on 'start', ->
          my.drone.takeoff()
          after 10.seconds(), -> my.drone.land()
          after 15.seconds(), -> my.drone.stop()

With all that done, we can start up the robot and get the Crazyflie flying:

    .start()
