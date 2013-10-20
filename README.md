# cylon [![Build Status](https://secure.travis-ci.org/hybridgroup/cylon.png?branch=master)](http://travis-ci.org/hybridgroup/cylon)

A JavaScript robotics framework using node.js and nactor

## Getting Started
Install the module with: `npm install cylon`

```javascript
var cylon = require("cylon");
 
// Initialize the robot
var robot = cylon.robot({
  connection : { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device : { name: 'led', driver: 'led', pin: 13 },
  
  work : function() {
    // we do our thing here
    every(1.second(), function() { led.toggle(); });
  }
});

// start working
robot.work();
```

```coffee-script
cylon = require("cylon")
 
# Initialize the robot
robot = cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'
  device: 
    name: 'led', driver: 'led', pin: 13
  
  work : ->
    # we do our thing here
    every 1.second(), ->
      led.toggle()

# start working
robot.work
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 The Hybrid Group. Licensed under the Apache 2.0 license.
