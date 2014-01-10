# Analog Sensor

A quick example of using an Arduino's analog sensor with Cylon. The program will
log to the console when the sensor has hit it's upper and lower limits.

Before you run this program, make sure you have the `cylon-firmata` module
installed.

First, let's load up Cylon:

    Cylon = require '../..'

Now that we have Cylon imported, we can start defining our robot

    Cylon.robot

Let's define the connection to our Arduino:

      connection:
        name: "arduino"
        adaptor: "firmata"
        port: "/dev/ttyACM0"

Now we can define the analog sensor we're going to use, along with it's upper
and lower limits:

      device:
        name: 'sensor'
        driver: 'analogSensor'
        pin: 0
        upperLimit: 900
        lowerLimit: 100

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      work: (my) ->
        my.sensor.on 'upperLimit', (val) ->
          console.log "Upper limit reached: #{val}"

        my.sensor.on 'lowerLimit', (val) ->
          console.log "Lower limit reached: #{val}"

Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:

    .start()
