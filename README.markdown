[![Cylon.js](http://i.imgur.com/U3paNhR.png)](http://cylonjs.com)

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

## Getting Started

### Installation

All you need to get started on a new robot is the `cylon` module:

    npm install cylon

With the core module installed, now install the modules for whatever hardware
support you need. For the Arduino + LED blink example, we'll need the `firmata` module:

    npm install cylon-firmata

## Examples

### Arduino + LED

The below example connects to an Arduino over a serial connection, and blinks an
LED once per second.

The example requires that the Arduino have the Firmata sketch installed; which
can be obtained either through the Ardunio IDE or the `gort arduino upload
firmata` command available in [gort](http://gort.io).

```javascript
var Cylon = require('cylon');

// define the robot
var robot = Cylon.robot({
  // change the port to the correct one for your Arduino
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13 }
  },

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
  connections: {
    ardrone: { adaptor: 'ardrone', port: '192.168.1.1' }
  },

  devices: {
    drone: { driver: 'ardrone' }
  },

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
  connections: {
    digispark: { adaptor: 'digispark' },
    leapmotion: { adaptor: 'leapmotion' }
  },

  devices: {
    servo1: { driver: 'servo', pin: 0, connection: 'digispark' },
    servo2: { driver: 'servo', pin: 1, connection: 'digispark' },
    leapmotion: { driver: 'leapmotion', connection: 'leapmotion' }
  },

  work: function(my) {
    my.x = 90;
    my.z = 90;

    my.leapmotion.on('hand', function(hand) {
      my.x = hand.palmX.fromScale(-300, 300).toScale(30, 150);
      my.z = hand.palmZ.fromScale(-300, 300).toScale(30, 150);
    });

    every(100, function() {
      my.servo1.angle(my.x);
      my.servo2.angle(my.z);

      console.log(my.servo1.currentAngle() + ", " + my.servo2.currentAngle());
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

bots.forEach(function(bot) {
  Cylon.robot({
    name: bot.name,

    connections: {
      sphero: { adaptor: "sphero", port: bot.port }
    },

    devices: {
      sphero: { driver: "sphero" }
    },

    work: function(my) {
      every((1).second(), function() {
        console.log(my.name);
        my.sphero.setRandomColor();
        my.sphero.roll(60, Math.floor(Math.random() * 360));
      });
    }
  });
});

// start up all robots at once
Cylon.start();
```

## Fluent Syntax

For those more familiar with jQuery, D3, or other fluent-style JavaScript
libraries, Cylon.JS also supports a fluent syntax:


```javascript
var Cylon = require('cylon');

Cylon
  .robot()
  .connection('arduino', { adaptor: 'firmata', port: '/dev/ttyACM0' })
  .device('led', { driver: 'led', pin: 13 })
  .on('ready', function(bot) {
    setInterval(function() {
      bot.led.toggle();
    }, 1000);
  });

Cylon.start();
```

## Hardware Support

Cylon.js has an extensible syntax for connecting to multiple, different hardware
devices. The following 32 platforms are currently supported:

Platform  | Support
--------  | -------
[Ardrone](http://ardrone2.parrot.com/)                                                                | [cylon-ardrone](https://github.com/hybridgroup/cylon-ardrone)
[Arduino](http://www.arduino.cc/)                                                                     | [cylon-firmata](https://github.com/hybridgroup/cylon-firmata)
[Arduino YUN](http://arduino.cc/en/Main/ArduinoBoardYun?from=Products.ArduinoYUN)                     | [cylon-firmata](https://github.com/hybridgroup/cylon-firmata)
[AT&T M2X](https://m2x.att.com)                                                                       | [cylon-m2x](https://github.com/hybridgroup/cylon-m2x)
[Audio]()                                                                                             | [cylon-audio](https://github.com/hybridgroup/cylon-audio)
[Beaglebone Black](http://beagleboard.org/Products/BeagleBone+Black/)                                 | [cylon-beaglebone](https://github.com/hybridgroup/cylon-beaglebone)
[Bluetooth LE](http://en.wikipedia.org/wiki/Bluetooth_low_energy)                                     | [cylon-ble](https://github.com/hybridgroup/cylon-ble)
[Crazyflie](http://www.bitcraze.se/)                                                                  | [cylon-crazyflie](https://github.com/hybridgroup/cylon-crazyflie)
[Digispark](http://digistump.com/products/1)                                                          | [cylon-digispark](https://github.com/hybridgroup/cylon-digispark)
[Intel Edison](http://www.intel.com/content/www/us/en/do-it-yourself/edison.html)                     | [cylon-intel-iot](https://github.com/hybridgroup/cylon-intel-iot)
[Intel Galileo](http://www.intel.com/content/www/us/en/do-it-yourself/galileo-maker-quark-board.html) | [cylon-intel-iot](https://github.com/hybridgroup/cylon-intel-iot)
[Joystick](http://en.wikipedia.org/wiki/Joystick)                                                     | [cylon-joystick](https://github.com/hybridgroup/cylon-joystick)
[Keyboard](http://en.wikipedia.org/wiki/Computer_keyboard)                                            | [cylon-keyboard](https://github.com/hybridgroup/cylon-keyboard)
[Leap Motion](https://www.leapmotion.com/)                                                            | [cylon-leapmotion](https://github.com/hybridgroup/cylon-leapmotion)
[MQTT](http://mqtt.org/)                                                                              | [cylon-mqtt](https://github.com/hybridgroup/cylon-mqtt)
[Nest](http://nest.com/)                                                                              | [cylon-nest](https://github.com/hybridgroup/cylon-nest)
[Neurosky](http://store.neurosky.com/products/mindwave-mobile)                                        | [cylon-neurosky](https://github.com/hybridgroup/cylon-neurosky)
[Ollie](http://gosphero.com/ollie)                                                                    | [cylon-ollie](https://github.com/hybridgroup/cylon-ollie)
[OpenCV](http://opencv.org/)                                                                          | [cylon-opencv](https://github.com/hybridgroup/cylon-opencv)
[Phillips Hue](http://www2.meethue.com/)                                                              | [cylon-hue](https://github.com/hybridgroup/cylon-hue)
[Pebble](http://www.getpebble.com/)                                                                   | [cylon-pebble](https://github.com/hybridgroup/cylon-pebble)
[Pinoccio](https://pinocc.io)                                                                         | [cylon-pinoccio](https://github.com/hybridgroup/cylon-pinoccio)
[PowerUp 3.0](http://www.poweruptoys.com/products/powerup-v3)                                         | [cylon-powerup](https://github.com/hybridgroup/cylon-powerup)
[Rapiro](http://www.rapiro.com/)                                                                      | [cylon-rapiro](https://github.com/hybridgroup/cylon-rapiro)
[Raspberry Pi](http://www.raspberrypi.org/)                                                           | [cylon-raspi](https://github.com/hybridgroup/cylon-raspi)
[Salesforce](http://www.force.com/)                                                                   | [cylon-force](https://github.com/hybridgroup/cylon-force)
[Skynet](http://skynet.im/)                                                                           | [cylon-skynet](https://github.com/hybridgroup/cylon-skynet)
[Spark](http://www.spark.io/)                                                                         | [cylon-spark](https://github.com/hybridgroup/cylon-spark)
[Speech]()                                                                                            | [cylon-speech](https://github.com/hybridgroup/cylon-speech)
[Sphero](http://www.gosphero.com/)                                                                    | [cylon-sphero](https://github.com/hybridgroup/cylon-sphero)
[Tessel](https://tessel.io/)                                                                          | [cylon-tessel](https://github.com/hybridgroup/cylon-tessel)
[WICED Sense](http://www.broadcom.com/products/wiced/sense/)                                          | [cylon-wiced-sense](https://github.com/hybridgroup/cylon-wiced-sense)

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

## Browser & Mobile Support

Cylon.js can be run directly in-browser, using the `browserify` NPM module. You can also run it from withing a Chrome connected app, or a PhoneGap mobile app.

For more info on browser support, and for help with different configurations, you can find more info [in our docs](/documentation/guides/browser-support).

## API

Cylon has a built-in API that you can interact with your robots.

All you need to start up the API server is to place the following command in your `.js` file after you require Cylon.

```javascript
var Cylon = require("cylon");
Cylon.api();
```

Then visit `https://localhost:3000/` and you are ready to control your robots from a web browser!
<img src="http://cylonjs.com/images/screenshots/robeaux.png" style="margin-top: 15px; width: 100%">

You can check out more information on the Cylon API in the docs [here](http://cylonjs.com/documentation/guides/api).

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

Version | Notes
------- | -----
0.21.2  | Update Robeaux version
0.21.1  | Add back debug logging for starting/connecting devices/connections
0.21.0  | Remove Connection/Device objects, update Robot connection/device syntax, fluent syntax updates
0.20.2  | Correct API issues, possible issue with test setups
0.20.1  | Revert accidental scrict handling of param in driver initializer
0.20.0  | Browser support, new module loading, log level support, misc. development changes
0.19.1  | Correct issue with dynamic method proxying
0.19.0  | Fluent syntax, improved start/halt, various other updates
0.18.0  | Updates Robot and Driver commands structure
0.17.0  | Updates to API to match CPPP-IO spec
0.16.0  | New IO Utils, removal of Utils#bind, add Adaptor#_noop method.
0.15.1  | Fixed issue with the API on Tessel
0.15.0  | Better halting, cleaner startup, removed 'connect' and 'start' events, and misc other cleanups/refactors.
0.14.0  | Removal of node-namespace and misc. cleanup
0.13.3  | Fixes bug with disconnect functions not being called.
0.13.2  | Use pure Express, adds server-sent-events, upd API.
0.13.1  | Add API authentication and HTTPS support
0.13.0  | Set minimum Node version to 0.10.20, add utils to global namespace and improve initialization routines
0.12.0  | Extraction of CLI tooling
0.11.2  | bugfixes
0.11.0  | Refactor into pure JavaScript
0.10.4  | Add JS helper functions
0.10.3  | Fix dependency issue
0.10.2  | Create connections convenience vars, refactor config loading
0.10.1  | Updates required for test driven robotics, update Robeaux version, bugfixes
0.10.0  | Use Robeaux UX, add CLI commands for helping connect to devices, bugfixes
0.9.0   | Add AngularJS web interface to API, extensible commands for CLI
0.8.0   | Refactored Adaptor and Driver into proper base classes for easier authoring of new modules
0.7.0   | cylon command for generating new adaptors, support code for better GPIO support, literate examples
0.6.0   | API exposes robot commands, fixes issues in driver/adaptor init
0.5.0   | Improve API, add GPIO support for reuse in adaptors
0.4.0   | Refactor proxy in Cylon.Basestar, improve API
0.3.0   | Improved Cylon.Basestar, and added API
0.2.0   | Cylon.Basestar to help develop external adaptors/drivers
0.1.0   | Initial release for ongoing development

## License

Copyright (c) 2013-2014 The Hybrid Group. Licensed under the Apache 2.0 license.
