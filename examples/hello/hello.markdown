# Hello

For this exceedingly simple example, we're going to define a robot that has no
devices, no connections, and just demonstrates the tools for performing work on
an interval, and after a timeout.

Let's start by importing Cylon:

    var Cylon = require('../..');

Now we can define our robot:

    Cylon.robot({
      name: 'test',

      connections: {
        loopback: { adaptor: 'loopback' }
      },

      devices: {
        ping: { driver: 'ping' }
      },

For work, it's going to print a message to the console every second, and another
message after five seconds have elapsed.

      work: function(my) {
        every((1).seconds(), function(){
          console.log("Hello, human!")
          console.log(my.ping.ping());
        });

        after((5).seconds(), function(){
          console.log("I've been at your command for 5 seconds now.")
        });
      }

Simple as can be. Now that we're done, let's start the robot:

    }).start();
