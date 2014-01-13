# Cylon.js For <%= adaptorClassName %>

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and
physical computing using Node.js

This repository contains the Cylon adaptor for <%= adaptorClassName %>.

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our
sister project Gobot (http://gobot.io).

For more information about Cylon, check out our repo at
https://github.com/hybridgroup/cylon

## Getting Started

Install the module with: `npm install <%= adaptorName %>`

## Examples

## Connecting

### JavaScript

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connection: { name: '<%= basename %>', adaptor: '<%= basename %>' },
  device: {name: '<%= basename %>', driver: '<%= basename %>'},

  work: function(my) {
    // provide an example of your module here
  }
}).start();
```

### CoffeeScript

```
Cylon = require 'cylon'

Cylon.robot
  connection: { name: '<%= basename %>', adaptor: '<%= basename %>' }
  device: { name: '<%= basename %>', driver: '<%= basename %>' }

  work: (my) ->
    # provide an example of your module here

.start()
```

Explain how to connect from the computer to the device here...

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## Release History

None yet...

## License

Copyright (c) 2014 Your Name Here. See `LICENSE` for more details
