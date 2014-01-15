[![Cylon.js](https://raw.github.com/hybridgroup/cylon/gh-pages/images/elements/logo.png)](http://cylonjs.com)

http://cylonjs.com

Cylon.js is a JavaScript framework for robotics and physical computing using Node.js.

It provides a simple, yet powerful way to create solutions that incorporate multiple, different hardware devices at the same time.

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io).

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon.png?branch=master)](http://travis-ci.org/hybridgroup/cylon)

## Examples:

### Basic

#### Arduino with an LED, using the Firmata protocol.

The example below connects to an Arduino, and every second turns the LED either on, or off. 

The example requires that the Arduino has the Firmata sketch installed, and that it is connected on the port `/dev/ttyACM0`. You need to install Firmata on your Arduino, and to change the `port` parameter to match the port that your system is actually using.

Make sure to upload the "Standard Firmata" sketch or an equivalent Firmata sketch to your Arduino first. Without that code running on the Arduino, Firmata can't communicate with Cylon. You can find the example sketch in your Arduino software under "Examples > Firmata > StandardFirmata".

##### JavaScript:

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

##### CoffeeScript:

```javascript
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
#### Parrot ARDrone 2.0

##### JavaScript:

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1' },
  device: { name: 'drone', driver: 'ardrone' },

  work: function(my) {
    my.drone.takeoff();
    after(10..seconds(), function() { my.drone.land(); });
    after(15..seconds(), function() { my.drone.stop(); });
  }
}).start();
```
##### CoffeeScript:

```javascript
Cylon = require 'cylon'

Cylon.robot
  connection: { name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1' }
  device: { name: 'drone', driver: 'ardrone' }

  work: (my) ->
    my.drone.takeoff()
    after 10.seconds(), -> my.drone.land()
    after 15.seconds(), -> my.drone.stop()

.start()
```

**Note:** before running any examples in the `examples/` dir from source, make sure to compile using `grunt coffee` first.

## Hardware Support

Cylon.js has a extensible system for connecting to hardware devices. The following robotics, physical computing, or software platforms are currently supported:

- [Ardrone](http://ardrone2.parrot.com/) <==> [Adaptor/Drivers](https://github.com/hybridgroup/cylon-ardrone)
- [Arduino](http://www.arduino.cc/) <==> [Adaptor](https://github.com/hybridgroup/cylon-firmata)
- [Beaglebone Black](http://beagleboard.org/Products/BeagleBone+Black/) <==> [Adaptor](https://github.com/hybridgroup/cylon-beaglebone)
- [Crazyflie](http://www.bitcraze.se/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-crazyflie)
- [Joystick](http://en.wikipedia.org/wiki/Joystick) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-joystick)
- [Keyboard](http://en.wikipedia.org/wiki/Computer_keyboard) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-keyboard)
- [Leap Motion](https://www.leapmotion.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-leapmotion)
- [OpenCV](http://opencv.org/) <==> [Adaptor/Drivers](https://github.com/hybridgroup/cylon-opencv)
- [Pebble](http://www.getpebble.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-pebble)
- [Raspberry Pi](http://www.raspberrypi.org/) <==> [Adaptor](https://github.com/hybridgroup/cylon-raspi)
- [Salesforce](http://www.force.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-force)
- [Spark](http://www.spark.io/) <==> [Adaptor](https://github.com/hybridgroup/cylon-spark)
- [Sphero](http://www.gosphero.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-sphero)

Support for many devices that use General Purpose Input/Output (GPIO) have
a shared set of drivers provided using the cylon-gpio module:

  - [GPIO](https://en.wikipedia.org/wiki/General_Purpose_Input/Output) <=> [Drivers](https://github.com/hybridgroup/cylon-gpio)
    - Analog Sensor
    - Button
    - Continuous Servo
    - LED
    - Motor
    - Maxbotix Ultrasonic Range Finder
    - Servo

Support for devices that use Inter-Integrated Circuit (I2C) have a shared set of
drivers provided using the cylon-i2c module:

  - [I2C](https://en.wikipedia.org/wiki/I%C2%B2C) <=> [Drivers](https://github.com/hybridgroup/cylon-i2c)
    - BlinkM
    - HMC6352 Digital Compass

More platforms and drivers are coming soon... follow us on Twitter [@cylonjs](http://twitter.com/cylonjs) for latest updates.

## Getting Started

### Installation

All you need to get started is the `cylon` module:

    npm install cylon

Then install modules for whatever hardware support you want to use from your robot. For the example below, an Arduino using the Firmata protocol:

    npm install cylon-firmata

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

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & Lint and test your code using [Grunt](http://gruntjs.com/).
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

[![NPM](https://nodei.co/npm/cylon.png?compact=true)](https://nodei.co/npm/cylon/) 

Version 0.9.0 - Add AngularJS web interface to API, extensible commands for CLI

Version 0.8.0 - Refactored Adaptor and Driver into proper base classes for easier authoring of new modules

Version 0.7.0 - cylon command for generating new adaptors, support code for better GPIO support, literate examples

Version 0.6.0 - API exposes robot commands, fixes issues in driver/adaptor init

Version 0.5.0 - Improve API, add GPIO support for reuse in adaptors 

Version 0.4.0 - Refactor proxy in Cylon.Basestar, improve API

Version 0.3.0 - Improved Cylon.Basestar, and added API

Version 0.2.0 - Cylon.Basestar to help develop external adaptors/drivers

Version 0.1.0 - Initial release for ongoing development

## License

Copyright (c) 2013-2014 The Hybrid Group. Licensed under the Apache 2.0 license.
