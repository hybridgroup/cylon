# Conway's Game Of Life - With Spheros

For this Cylon example, we're going to run a version of [Conway's Game Of
Life][gol], using Spheros as cells.

[gol]: https://en.wikipedia.org/wiki/Conway's_Game_of_Life

To account for the fact that we're now using Spheros to play the game, we need
to make some changes to the mechanics. Here's how our version of Conway's Game
will go:

- "alive" Spheros glow green, "dead" spheros glow red.
- At the start of the game, all Spheros are "alive".
- On every tick, the "alive" Spheros roll randomly, and count the number of
  collisions they have.
- After the tick, all the Spheros that had between two and six collisions are
  considered "alive", and those with less than two or more than six collisions
  are now "dead"
- If a "dead" Sphero is bumped into by an "alive" one, or has collisions through
  other means, it can become "alive" again.

With those alterations in hand, let's start building it with Cylon! Before you
start, make sure you have the `cylon-sphero` module installed.

First off, let's load up Cylon:

    var Cylon = require('../..');

For easier use later, let's define the colors we'll be using with the Spheros,
green for alive and red for dead:

    var Green = 0x0000FF,
        Red = 0xFF0000;

We'll be using four robots for this example, but they'll have very similar
programming so we just need to define what's different between them for now.
Each of the robots will have a unique name, and will communicate on their own
port.

    var bots = {
      'Thelma': '/dev/rfcomm0',
      'Louise': '/dev/rfcomm1',
      'Grace':  '/dev/rfcomm2',
      'Ada':    '/dev/rfcomm3'
    };

That gets the basics out of the way.

Since, as previously mentioned, our robots all have the same basic
functionality, we can just loop over the `bots` object, and create robots as we
go.

    Object.keys(bots).forEach(function(name) {
      var port = bots[name];

All of our robots will be connecting to a Sphero, and be operating via a single
device (you guessed it, a Sphero).

      Cylon.robot({
        name: name,

        connections: {
          sphero: { adaptor: 'sphero', port: port }
        },

        devices: {
          sphero: { driver: 'sphero' }
        },

Now that the pieces are there, we can set up our robot's work. It starts by
being "born", then moves every three seconds if it's alive, celebrates it's
birthday every ten seconds, and increments it's contacts every time the Sphero
detects a collision.

        work: function(my) {
          my.born();

          my.sphero.on('collision', function() {
            my.contacts += 1;
          });

          every((3).seconds(), function() {
            if (my.alive) {
              my.move();
            }
          });

          every((10).seconds(), function() {
            my.birthday();
          });
        },

When a robot is asked to move, it rolls in a random direction at speed 60.

        move: function() {
          this.sphero.roll(60, Math.floor(Math.random() * 360));
        },

When the robots are first started, they are born. This sets their contacts to
zero, their age to zero, makes them "alive", and starts them moving for the
first tick.

        born: function() {
          this.contacts = 0;
          this.age = 0;
          this.life();
          this.move();
        },

In the case of our robots, "life" just means the robot's internal "alive" state
is set to `true`, and the Sphero's LED is set to green.

        life: function() {
          this.alive = true;
          this.sphero.setRGB(Green);
        },

Similarly, "death" just sets the "alive" state to false, the Sphero's color to
red, and stops the Sphero from moving.

        death: function() {
          this.alive = false;
          this.sphero.setRGB(Red);
          this.sphero.stop();
        },

A robot is decided to have enough contacts if it has between two and six
contacts.

        enoughContacts: function() {
          return this.contacts >= 2 && this.contacts < 7;
        },

On a robot's birthday, it increments it's age, prints it's name, age, and
contacts to the console, and then determines if it's now alive or dead based on
the number of contacts it had in the last tick.

        birthday: function() {
          this.age += 1;

          if (this.alive) {
            console.log("Happy birthday, " + this.name + ". You are " + this.age + " and had " + this.contacts + " contacts.");
          }

          if (this.enoughContacts()) {
            if (!this.alive) {
              this.born();
            }
          } else {
            this.death();
          }

          this.contacts = 0;
        }
      });
    });

Now that Cylon knows about our robots and what they do, we can get started!

    Cylon.start();
