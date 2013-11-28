Cylon = require '../..'

Cylon.robot
  connection:
    name: 'crazyflie', adaptor: 'crazyflie', port: "radio://1/10/250KPS"

  device:
    name: 'drone', driver: 'crazyflie'

  work: (my) ->
    my.drone.on 'start', ->
      my.drone.takeoff()
      after 10.seconds(), -> my.drone.land()
      after 15.seconds(), -> my.drone.stop()

.start()
