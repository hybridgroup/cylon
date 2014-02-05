---
page_title_show: true
title: Intro Robeaux- A Universal User Interface To Robotic Devices
page_title: Blog
date: 2014-02-05
tags: robots
author: Ron Evans
---

We've been hard at work since [ng-conf](http://ng-conf.org/) last month here on Team Cylon.js, and we've just released version 0.10 of our JavaScript framework for robotics and the Internet of Things. We've added many powerful new features, as well as support for ever more hardware.

Last release, we added a web-based user interface to the Cylon.js API based on AngularJS ([http://angularjs.org/](http://angularjs.org/)). That idea was so powerful, that we've extracted it into a new separate library. Called Robeaux ([http://robeaux.io](http://robeaux.io)), we think of it like a universal dashboard to all your robotic systems. Similar to how a router has built-in pages to help administer it, and verify connectivity. We're now using it within the newest releases of Cylon.js, Artoo ([http://artoo.io](http://artoo.io)), and Gobot ([http://gobot.io](http://gobot.io)).

The CLI that we added last release has been upgraded to support a lot more functionality. You can easily use the command line to scan for connected ports, pair with bluetooth devices, and more. We've also added commands to the [cylon-firmata](https://github.com/hybridgroup/cylon-firmata) adaptor to install the needed firmware on your connected Arduino board. Likewise, the new [cylon-digispark](https://github.com/hybridgroup/cylon-digispark) adaptor has built-in commands to install Little Wire on your Digispark board.

We've also added lots more hardware support. As just mentioned above, the Digispark USB-microcontroller now has an adaptor that supports all the Cylon.js GPIO and i2c drivers. We have added support for the PS3 'dualshock' controller in the [cylon-joystick](https://github.com/hybridgroup/cylon-joystick) adaptor. And we've also added more i2c devices such as the backpack LCD, and the MPL115A2 digital barometer/thermometer.

The "MakeyButton" is our new GPIO driver, inspired by the wonderful MakeyMakey ([http://makeymakey.com](http://makeymakey.com)). It lets you connect a high Ohm resistor to any digital IO pin on an Arduino, Raspberry Pi, or any platform that supports GPIO. Using a very simple circuit with this resistor, you can use anything conductive to trigger your devices. Such as bananas, or conductive ink pens.

We've upgraded our Sphero ([http://gosphero.com](http://gosphero.com)) support, by making it easy (read: possible) to orient the Sphero's front direction. Yes, at last! This has probably been our number one asked for feature.

The entire documentation site for Cylon.js has been updated to better serve your needs. The API formatting and info has been very much improved, and we've also added more examples. 

We're very excited about this new release. Please let us know what you think!
