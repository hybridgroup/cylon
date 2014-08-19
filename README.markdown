[![Cylon.js](https://cdn.rawgit.com/hybridgroup/cylon-site/master/source/images/elements/cylon.png)](http://cylonjs.com)

Cylon.js is a JavaScript framework for robotics and physical computing built on
top of Node.js.

It provides a simple, but powerful way to create solutions that incorporate
multiple, different hardware devices concurrently.

Want to use Ruby on robots? Check out our sister project, [Artoo][].

Want to use Golang to power your robots? Check out our sister project,
[Gobot][].

[Artoo]: http://artoo.io
[Gobot]: http://gobot.io

## Build Status:

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon.png?branch=master)](http://travis-ci.org/hybridgroup/cylon) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon.png)](https://codeclimate.com/github/hybridgroup/cylon) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon/coverage.png)](https://codeclimate.com/github/hybridgroup/cylon)

## Examples

### Arduino + LED

The below example connects to an Arduino over a serial connection, and blinks an
LED once per second.

The example requires that the Arduino have the Firmata sketch installed; which
can be obtained either through the Ardunio IDE or the `cylon arduino upload
firmata` command available in [cylon-cli][].

```javascript
var Cylon = require('cylon');

// define the robot
var robot = Cylon.robot({
  // change the port to the correct one for your Arduino
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'led', driver: 'led', pin: 13 },

  work: function(my) {
    every((1).second(), my.led.toggle);
  }
});

// connect to the Arduino and start working
robot.start();
```

### Parrot ARDrone 2.0

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1' },
  device: { name: 'drone', driver: 'ardrone' },

  work: function(my) {
    my.drone.takeoff();
    after((10).seconds(), my.drone.land);
    after((15).seconds(), my.drone.stop);
  }
}).start();
```

### Cat Toy (Leap Motion + Digispark + Servos)

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connections: [
    { name: 'digispark', adaptor: 'digispark'},
    { name: 'leapmotion', adaptor: 'leapmotion', port: '127.0.0.1:6437' }
  ],

  devices: [
    {name: 'servo1', driver: 'servo', pin: 0, connection: 'digispark'},
    {name: 'servo2', driver: 'servo', pin: 1, connection: 'digispark'},
    {name: 'leapmotion', driver: 'leapmotion', connection: 'leapmotion'}
  ],

  work: function(my) {
    my['x'] = 90;
    my['z'] = 90;

    my.leapmotion.on('hand', function(hand) {
      my['x'] = hand.palmX.fromScale(-300, 300).toScale(30, 150);
      my['z'] = hand.palmZ.fromScale(-300, 300).toScale(30, 150);
    });

    every(100, function() {
      my.servo1.angle(my['x']);
      my.servo2.angle(my['z']);

      console.log("Current Angle: " + my.servo1.currentAngle() + ", " + my.servo2.currentAngle());
    });
  }
}).start();
```

### Multiple Spheros + API Server

```javascript
var Cylon = require('cylon');

// tell the API server to listen for requests at
// https://localhost:4000
Cylon.api({ port: 4000 });

var bots = [
  { port: '/dev/rfcomm0', name: 'Thelma' },
  { port: '/dev/rfcomm1', name: 'Louise' }
];

var SpheroBot = function() {};

SpheroBot.prototype.connection = { name: "sphero", adaptor: "sphero" };
SpheroBot.prototype.device = { name: "sphero", driver: "sphero" };

SpheroBot.prototype.work = function(my) {
  every((1).second(), function() {
    console.log(my.name);
    my.sphero.setRandomColor();
    my.sphero.roll(60, Math.floor(Math.random() * 360));
  });
};

for (var i = 0; i < bots.length; i++) {
  var bot = bots[i];
  var robot = new SpheroBot();

  robot.connection.port = bot.port;
  robot.name = bot.name;

  Cylon.robot(robot);
}

// start up all robots at once
Cylon.start();
```

## Hardware Support

Cylon.js has an extensible syntax for connecting to multiple, different hardware
devices. The following 21 platforms are currently supported:

- [Ardrone](http://ardrone2.parrot.com/) <==> [Adaptor/Drivers](https://github.com/hybridgroup/cylon-ardrone)
- [Arduino](http://www.arduino.cc/) <==> [Adaptor](https://github.com/hybridgroup/cylon-firmata)
- [Arduino YUN](http://arduino.cc/en/Main/ArduinoBoardYun?from=Products.ArduinoYUN) <==> [Adaptor](https://github.com/hybridgroup/cylon-firmata)
- [Beaglebone Black](http://beagleboard.org/Products/BeagleBone+Black/) <==> [Adaptor](https://github.com/hybridgroup/cylon-beaglebone)
- [Crazyflie](http://www.bitcraze.se/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-crazyflie)
- [Digispark](http://digistump.com/products/1) <==> [Adaptor](https://github.com/hybridgroup/cylon-digispark)
- [Joystick](http://en.wikipedia.org/wiki/Joystick) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-joystick)
- [Keyboard](http://en.wikipedia.org/wiki/Computer_keyboard) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-keyboard)
- [Leap Motion](https://www.leapmotion.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-leapmotion)
- [Nest](http://nest.com/) <==> [Adaptor/Drivers](https://github.com/hybridgroup/cylon-nest)
- [Neurosky](http://store.neurosky.com/products/mindwave-mobile) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-neurosky)
- [OpenCV](http://opencv.org/) <==> [Adaptor/Drivers](https://github.com/hybridgroup/cylon-opencv)
- [Pebble](http://www.getpebble.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-pebble)
- [Pinoccio](https://pinocc.io) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-pinoccio)
- [Rapiro](http://www.rapiro.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-rapiro)
- [Raspberry Pi](http://www.raspberrypi.org/) <==> [Adaptor](https://github.com/hybridgroup/cylon-raspi)
- [Salesforce](http://www.force.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-force)
- [Skynet](http://skynet.im/) <==> [Adaptor](https://github.com/hybridgroup/cylon-skynet)
- [Spark](http://www.spark.io/) <==> [Adaptor](https://github.com/hybridgroup/cylon-spark)
- [Sphero](http://www.gosphero.com/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-sphero)
- [Tessel](https://tessel.io/) <==> [Adaptor/Driver](https://github.com/hybridgroup/cylon-tessel)

Our implementation of GPIO (General Purpose Input/Output) allows for a shared
set of drivers supporting a number of devices:

  - [GPIO](https://en.wikipedia.org/wiki/General_Purpose_Input/Output) <=> [Drivers](https://github.com/hybridgroup/cylon-gpio)
    - Analog Sensor
    - Button
    - Continuous Servo
    - Direct Pin
    - IR Rangefinder
    - LED
    - MakeyButton
    - Motor
    - Maxbotix Ultrasonic Range Finder
    - Servo

Additionally, we also support a number of I2C (Inter-Integrated Circuit) devices
through a shared `cylon-i2c` module:

  - [I2C](https://en.wikipedia.org/wiki/I%C2%B2C) <=> [Drivers](https://github.com/hybridgroup/cylon-i2c)
    - BlinkM
    - BMP180
    - HMC6352 Digital Compass
    - LCD Display
    - MPL115A2 Barometer/Thermometer
    - MPU6050

We'll also have many more platforms and drivers coming soon, [follow us on
Twitter][Twitter] for updates.

[Twitter]: https://twitter.com/cylonjs

## Getting Started

### Installation

All you need to get started on a new robot is the `cylon` module:

    npm install cylon

With the core module installed, now install the modules for whatever hardware
support you need. For the Arduino + LED blink example, we'll need the 'firmata',
'gpio', and 'i2c' modules:

    npm install cylon-firmata cylon-gpio cylon-i2c

## CLI

Cylon uses the Gort [http://gort.io](http://gort.io) Command Line Interface (CLI) so you can access important features right from the command line. We call it "RobotOps", aka "DevOps For Robotics". You can scan, connect, update device firmware, and more!

Cylon also has its own CLI to generate new robots, adaptors, and drivers. You can check it out at [https://github.com/hybridgroup/cylon-cli](https://github.com/hybridgroup/cylon-cli).

## Documentation

We're busy adding documentation to our website, check it out at
[cylonjs.com/documentation][docs].

If you want to help with documentation, you can find the code for our website at
on the [https://github.com/hybridgroup/cylon-site](https://github.com/hybridgroup/cylon-site).

[docs]: http://cylonjs.com/documentation
[docs site]: https://github.com/hybridgroup/cylon-site

## Contributing

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & lint and test your code using `make test` and `make lint`.
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

Version 0.18.0 - Updates Robot and Driver commands structure

Version 0.17.0 - Updates to API to match CPPP-IO spec

Version 0.16.0 - New IO Utils, removal of Utils#bind, add Adaptor#_noop method.

Version 0.15.1 - Fixed issue with the API on Tessel

Version 0.15.0 - Better halting, cleaner startup, removed 'connect' and 'start'
                 events, and misc other cleanups/refactors.

Version 0.14.0 - Removal of node-namespace and misc. cleanup

Version 0.13.3 - Fixes bug with disconnect functions not being called.

Version 0.13.2 - Use pure Express, adds server-sent-events, upd API.

Version 0.13.1 - Add API authentication and HTTPS support

Version 0.13.0 - Set minimum Node version to 0.10.20, add utils to global namespace and improve initialization routines

Version 0.12.0 - Extraction of CLI tooling

Version 0.11.2 - bugfixes

Version 0.11.0 - Refactor into pure JavaScript

Version 0.10.4 - Add JS helper functions

Version 0.10.3 - Fix dependency issue

Version 0.10.2 - Create connections convenience vars, refactor config loading

Version 0.10.1 - Updates required for test driven robotics, update Robeaux version, bugfixes

Version 0.10.0 - Use Robeaux UX, add CLI commands for helping connect to devices, bugfixes

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
