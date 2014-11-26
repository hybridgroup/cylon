# API

In this Cylon example, we'll be demonstrating the HTTP API that Cylon spins up
when it starts.

This example involves two Spheros, so before you start make sure you have the
`cylon-sphero` module installed.

First, let's import Cylon:

    var Cylon = require('../..');

Next up, we'll configure the API Cylon will serve, telling it to serve on port
`8080`.

    Cylon.api({
      host: '0.0.0.0',
      port: '8080'
    });

Since we're making two very similar robots (Spheros, in this case), let's put
the different parts of each robot in objects so we can initialize them later.
The only differences between the bots are their names and the port they'll be
using.

    var bots = {
      'Thelma': '/dev/rfcomm0',
      'Louise': '/dev/rfcomm1'
    };

Now we can define the basic robot both of our Sphero robots will be based on.

    Object.keys(bots).forEach(function(name) {
      var port = bots[name];

      Cylon.robot({
        name: name,

Both robots will be connecting to Spheros, and so using the cylon-sphero
adaptor:

        connections: {
          sphero: { adaptor: 'sphero', port: port }
        },

And both will be connecting to the same kind of device (you guessed it,
a Sphero).

        devices: {
          sphero: { driver: 'sphero' }
        },

Both robots will be performing the same kind of work as well.  Every second,
they'll print their name to the console, set themselves to a random color, and
roll in a random direction.

        work: function(my) {
          every((1).seconds(), function() {
            console.log(my.name);
            my.sphero.setRandomColor();
            my.sphero.roll(60, Math.floor(Math.random() * 360));
          });
        }
    });

And now that Cylon has all the robots we're intending to give it, let's get
started!

    Cylon.start();

Now Cylon will start up the robots and their devices, as well as an API server
listening on `0.0.0.0:8080`.
