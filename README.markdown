[![Cylon.js](http://i.imgur.com/U3paNhR.png)](http://cylonjs.com)

Cylon.js is a JavaScript framework for robotics, physical computing, and the Internet of Things (IoT).

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
support you need. For the Arduino + LED blink example, we'll need the `firmata`, `gpio`, and `i2c` modules:

    npm install cylon-firmata cylon-gpio cylon-i2c

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

### Multiple Spheros + HTTP API Plugin

To use the HTTP API plugin, first install it's NPM module:

    $ npm install cylon-api-http

Then it can be used in scripts:

```javascript
var Cylon = require('cylon');

// tell the HTTP API plugin to listen for requests at https://localhost:4000
Cylon.api("http", { port: 4000 });

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
libraries, Cylon.JS also supports a chainable syntax:


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
devices. The following 36 platforms are currently supported:

Platform  | Support
--------  | -------
[ARDrone](http://ardrone2.parrot.com/)                                                                | [cylon-ardrone](https://github.com/hybridgroup/cylon-ardrone)
[Arduino](http://www.arduino.cc/)                                                                     | [cylon-firmata](https://github.com/hybridgroup/cylon-firmata)
[Arduino YUN](http://arduino.cc/en/Main/ArduinoBoardYun?from=Products.ArduinoYUN)                     | [cylon-firmata](https://github.com/hybridgroup/cylon-firmata)
[AT&T M2X](https://m2x.att.com)                                                                       | [cylon-m2x](https://github.com/hybridgroup/cylon-m2x)
Audio                                                                                                 | [cylon-audio](https://github.com/hybridgroup/cylon-audio)
[Beaglebone Black](http://beagleboard.org/Products/BeagleBone+Black/)                                 | [cylon-beaglebone](https://github.com/hybridgroup/cylon-beaglebone)
[Bebop](http://www.parrot.com/products/bebop-drone/)                                                  | [cylon-bebop](https://github.com/hybridgroup/cylon-bebop)
[Bluetooth LE](http://en.wikipedia.org/wiki/Bluetooth_low_energy)                                     | [cylon-ble](https://github.com/hybridgroup/cylon-ble)
[Crazyflie](http://www.bitcraze.se/)                                                                  | [cylon-crazyflie](https://github.com/hybridgroup/cylon-crazyflie)
[Digispark](http://digistump.com/products/1)                                                          | [cylon-digispark](https://github.com/hybridgroup/cylon-digispark)
[Electric Imp](https://electricimp.com/product/)                                                      | [cylon-imp](https://github.com/hybridgroup/cylon-imp)
[Intel Edison](http://www.intel.com/content/www/us/en/do-it-yourself/edison.html)                     | [cylon-intel-iot](https://github.com/hybridgroup/cylon-intel-iot)
[Intel Galileo](http://www.intel.com/content/www/us/en/do-it-yourself/galileo-maker-quark-board.html) | [cylon-intel-iot](https://github.com/hybridgroup/cylon-intel-iot)
[Intel IoT Analytics](https://software.intel.com/en-us/intel-iot-developer-kit-cloud-based-analytics-user-guide) | [cylon-intel-iot-analytics](https://github.com/hybridgroup/cylon-intel-iot-analytics)
[Joystick](http://en.wikipedia.org/wiki/Joystick)                                                     | [cylon-joystick](https://github.com/hybridgroup/cylon-joystick)
[Keyboard](http://en.wikipedia.org/wiki/Computer_keyboard)                                            | [cylon-keyboard](https://github.com/hybridgroup/cylon-keyboard)
[Leap Motion](https://www.leapmotion.com/)                                                            | [cylon-leapmotion](https://github.com/hybridgroup/cylon-leapmotion)
[MiP](http://www.wowwee.com/mip/)                                                                     | [cylon-mip](https://github.com/hybridgroup/cylon-mip)
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
Speech                                                                                                | [cylon-speech](https://github.com/hybridgroup/cylon-speech)
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
  - Maxbotix Ultrasonic Range Finder
  - Motor
  - Relay
  - RGB LED
  - Servo

Additionally, we also support a number of I2C (Inter-Integrated Circuit) devices
through a shared `cylon-i2c` module:

- [I2C](https://en.wikipedia.org/wiki/I%C2%B2C) <=> [Drivers](https://github.com/hybridgroup/cylon-i2c)
  - BlinkM
  - BMP180
  - HMC6352 Digital Compass
  - LCD Display
  - LIDAR-Lite
  - LSM9DS0G 9 Degrees of Freedom IMU
  - LSM9DS0XM 9 Degrees of Freedom IMU
  - MPL115A2 Barometer/Thermometer
  - MPU6050 Triple Axis Accelerometer and Gyro
  - PCA9685 16-Channel 12-bit PWM/Servo Driver

In addition to our supported platforms, we have the following user contributed platforms:

Platform  | Support
--------  | -------
[Parrot Rolling Spider](http://www.parrot.com/usa/products/rolling-spider/)       | [cylon-rolling-spider](https://github.com/ChrisTheBaron/cylon-rolling-spider)
[PCDuino](http://www.pcduino.com/)                                                | [cylon-pcduino](https://github.com/alexwang2013/cylon-pcduino)
[iBeacon](https://developer.apple.com/ibeacon/)                                   | [cylon-beacon](https://github.com/juliancheal/cylon-beacon)
[WeMo](http://www.belkin.com/us/Products/home-automation/c/wemo-home-automation/) | [cylon-wemo](https://github.com/ChrisTheBaron/cylon-wemo)

We'll also have many more platforms and drivers coming soon, [follow us on Twitter][Twitter] for updates.

[Twitter]: https://twitter.com/cylonjs

## Browser & Mobile Support

Cylon.js can be run directly in-browser, using the `browserify` NPM module.
You can also run it from withing a Chrome connected app, or a PhoneGap mobile app.

For more info on browser support, and for help with different configurations, you can find more info [in our docs](/documentation/guides/browser-support).

## API Plugins

Cylon.js has support for different API plugins that can be used to interact with your robots remotely.
At this time we have support for [http/https](https://github.com/hybridgroup/cylon-api-http), [mqtt](https://github.com/hybridgroup/cylon-api-mqtt), and [socket.io](https://github.com/hybridgroup/cylon-api-socketio) with more coming in the near future.

To use an API plugin, install it alongside Cylon:

    $ npm install cylon-api-http cylon-api-socketio

Then, all you need to do is call `Cylon#api` in your robot's script:

```javascript
var Cylon = require("cylon");

// For http
Cylon.api('http');

// Or for Socket.io
Cylon.api('socketio');
```

Then visit `https://localhost:3000/` and you are ready to control your robots from a web browser!

<img src="http://cylonjs.com/images/screenshots/robeaux.jpg" style="margin-top: 15px; width: 100%">

You can check out more information on the Cylon API in the docs [here](http://cylonjs.com/documentation/guides/api).

## CLI

Cylon uses the Gort [http://gort.io](http://gort.io) Command Line Interface (CLI) so you can access important features right from the command line. We call it "RobotOps", aka "DevOps For Robotics". You can scan, connect, update device firmware, and more!

Cylon also has its own CLI to generate new robots, adaptors, and drivers. You can check it out at [https://github.com/hybridgroup/cylon-cli](https://github.com/hybridgroup/cylon-cli).

## Documentation

We're busy adding documentation to our website, check it out at [cylonjs.com/documentation][docs].

If you want to help with documentation, you can find the code for our website at on the [https://github.com/hybridgroup/cylon-site](https://github.com/hybridgroup/cylon-site).

[docs]: http://cylonjs.com/documentation
[docs site]: https://github.com/hybridgroup/cylon-site

## Contributing

For our contribution guidelines, please go to [CONTRIBUTING.md](https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md).

## Release History

For the release history, please go to [RELEASES.md](https://github.com/hybridgroup/cylon/blob/master/RELEASES.md).

## License

Copyright (c) 2013-2015 The Hybrid Group. Licensed under the Apache 2.0 license.
