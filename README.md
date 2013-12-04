# Cylon.js

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js.

It provides a simple, yet powerful way to create solutions that incorporate multiple, different hardware devices at the same time.

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io).

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon.png?branch=master)](http://travis-ci.org/hybridgroup/cylon)

## Getting Started

All you need to get started is the `cylon` module:

    npm install cylon

Then install modules for whatever hardware support you want to use from your robot. For the example below, an Arduino using the Firmata protocol:

    npm install cylon-firmata

## Examples

The example below connects to an Arduino, and every second turns the LED either on, or off. 

The example requires that the Arduino has the Firmata sketch installed, and that it is connected on the port `/dev/ttyACM0`. You need to install Firmata on your Arduino, and to change the `port` parameter to match the port that your system is actually using.

Make sure to upload the "Standard Firmata" sketch or an equivalent Firmata sketch to your Arduino first. Without that code running on the Arduino, Firmata can't communicate with Cylon. You can find the example sketch in your Arduino software under "Examples > Firmata > StandardFirmata".

### JavaScript:

```javascript
var Cylon = require("cylon");

// Initialize the robot
var robot = Cylon.robot({
  // Change the port to the correct port for your Arduino.
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'led', driver: 'led', pin: 13 },

  work: function(my) {
    // we do our thing here
    every((1).second(), function() { my.led.toggle(); });
  }
});

// start working
robot.start();
```

### CoffeeScript:

```
Cylon = require "cylon"

# Initialize the robot
robot = Cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

  device:
    name: 'led', driver: 'led', pin: 13

  work: (my) ->
    # we do our thing here
    every 1.second(), -> my.led.toggle()

robot.start()
```

**Note:** before running any examples in the `examples/` dir from source, make sure to compile using `grunt coffee` first.

## Hardware Support

Cylon.js has a extensible system for connecting to hardware devices. The following robotics, physical computing, or software platforms are currently supported:

- [Ardrone](http://ardrone2.parrot.com/) <==> [Adaptor/Drivers](https://github.com/hybridgroup/cylon-ardrone)
- [Arduino](http://www.arduino.cc/) <==> [Adaptor](https://github.com/hybridgroup/cylon-firmata)
- [Beaglebone Black](http://beagleboard.org/Products/BeagleBone+Black/) <==> [Adaptor](https://github.com/hybridgroup/cylon-beaglebone)
- [Crazyflie](http://www.bitcraze.se/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-crazyflie)
- [Leap Motion](https://www.leapmotion.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-leapmotion)
- [Pebble](http://www.getpebble.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-pebble)
- [Raspberry Pi](http://www.raspberrypi.org/) <==> [Adaptor](https://github.com/hybridgroup/cylon-raspi)
- [Salesforce](http://www.force.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-force)
- [Spark](http://www.spark.io/) <==> [Adaptor](https://github.com/hybridgroup/cylon-spark)
- [Sphero](http://www.gosphero.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-sphero)

Support for many devices that use General Purpose Input/Output (GPIO) have
a shared set of drivers provded using the cylon-gpio module:

  - [GPIO](https://en.wikipedia.org/wiki/General_Purpose_Input/Output) <=> [Drivers](https://github.com/hybridgroup/cylon-gpio)
    - Analog Sensor
    - Button
    - LED
    - Motor
    - Maxbotix Ultrasonic Range Finder
    - Servo

Support for devices that use Inter-Integrated Circuit (I2C) have a shared set of
drivers provded using the cylon-i2c module:

  - [I2C](https://en.wikipedia.org/wiki/I%C2%B2C) <=> [Drivers](https://github.com/hybridgroup/cylon-i2c)
    - BlinkM
    - HMC6352 Digital Compass

More platforms and drivers are coming soon...

## CLI

Cylon has a Command Line Interface (CLI) so you can access important features
right from the command line.

    Usage: cylon [command] [options]

    Commands:

      generate <name>        Generates a new adaptor

    Options:

      -h, --help     output usage information
      -V, --version  output the version number

### Generator

Want to integrate a hardware device we don't have Cylon support for yet? There's
a generator for that!

You can easily generate a new skeleton Cylon adaptor to
help you get started. Simply run the `cylon generate` command, and the
generator will create a new directory with all of the files in place for your
new adaptor module.

    $ cylon generate awesome_device
    Creating cylon-awesome_device adaptor.
    Compiling templates.

    $ ls ./cylon-awesome_device
    Gruntfile.js
    LICENSE
    README.md
    dist/
    package.json
    src/
    test/

## Documentation

We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

If you want to help us with some documentation on the site, you can go to [cylonjs.com branch](https://github.com/hybridgroup/cylon/tree/cylonjs.com) and then, follow the instructions.

Thank you!

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

[![NPM](https://nodei.co/npm/cylon.png?compact=true)](https://nodei.co/npm/cylon/) 

Version 0.6.0 - API exposes robot commands, fixes issues in driver/adaptor init

Version 0.5.0 - Improve API, add GPIO support for reuse in adaptors 

Version 0.4.0 - Refactor proxy in Cylon.Basestar, improve API

Version 0.3.0 - Improved Cylon.Basestar, and added API

Version 0.2.0 - Cylon.Basestar to help develop external adaptors/drivers

Version 0.1.0 - Initial release for ongoing development

## License

Copyright (c) 2013 The Hybrid Group. Licensed under the Apache 2.0 license.
