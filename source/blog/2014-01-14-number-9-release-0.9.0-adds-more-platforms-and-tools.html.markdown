---
page_title_show: true
title: Number 9! Release 0.9.0 Adds More Platforms and Tools
page_title: Blog
date: 2014-01-14
tags: robots
author: Ron Evans
---

Our team is kicking off our first release of 2014, with the brand new version 0.9.0 of Cylon.js (<a href="http://cylonjs.com" target="blank">http://cylonjs.com</a>), the powerful JavaScript robotics framework based on <a href="http://nodejs.org/" target="blank">Node.js</a>. This release adds support for 3 more platforms, along with some cool new command line tools.

We've now added <a href="https://github.com/hybridgroup/cylon-joystick" target="blank">cylon-joystick</a> an adaptor for USB joysticks, along with a driver that supports the <a href="http://en.wikipedia.org/wiki/Xbox_360_Controller" target="blank">XBox 360 controller</a>. This is only the first of several joystick drivers that we will be adding soon. We've also added <a href="https://github.com/hybridgroup/cylon-keyboard" target="blank">cylon-keyboard</a> an adaptor and driver for standard keyboard control of your robots. And perhaps most excitingly, we now have <a href="https://github.com/hybridgroup/cylon-opencv" target="blank">cylon-opencv</a>, adaptor and drivers for <a href="http://opencv.org/" target="blank">OpenCV</a> support, which is a powerful open source platform for computer vision.

This new 0.9.0 release also adds a powerful set of command line utilities. Each Cylon.js adaptor module can also add new commands that are specific to that platform. This CLI add-in capability just makes it that much easier to handle your "RobotOps" needs. We will be adding lots of platform specific utilties now that we have this capability.

We have also been continuing our work to make it easy for anyone to add support for new hardware platforms. The `cylon generate adaptor` command now uses the latest and greatest code that incorporate our best practices for adaptor development.

Please let us know how you like the new release, and anything we can do to improve. We're here to help!
