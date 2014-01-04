# Multiple Spheros

Let's do an example of Cylon controlling multiple Spheros at the same time. The
Spheros will both randomly roll around and change their colors every second.

Before we run this example, make sure to have `cylon-sphero` installed (`npm
install cylon-sphero`)

First, load up Cylon. Since we're in the Cylon repo, we can use the version
already here:

    Cylon = require '../..'

Since both of our Spheros are going to have faily similar behaviour, we can
define a class to hold their attributes:

    class SpheroRobot

We'll define the Sphero's connection sans port, which we'll add later.

      connection:
        name: 'Sphero', adaptor: 'sphero'

Both Spheros have the same device configuration

      device:
        name: 'sphero', driver: 'sphero'

Now we can define the work for the Spheros. Every second, they'll print their
name, change to a random color, and roll in a random direction.

      work: (my) ->
        every 1.seconds(), ->
          console.log my.name
          my.sphero.setRandomColor()
          my.sphero.roll 60, Math.floor(Math.random() * 360)

Next up, let's define what's different about our bots so we can tell them apart
later on. We'll give them each a different name, and define their connection
ports.

    bots = [
      { name: "Thelma", port: "/dev/rfcomm0" },
      { name: "Louise", port: "/dev/rfcomm1" }
    ]

Now that the pieces are in place, we can start making our robots.

    for bot in bots

We'll make a new instance of `SpheroRobot`, and modify it.

      robot = new SpheroRobot

Now we'll tell the robot what it's name is, and what it's connection port should
be:

      robot.name = bot.name
      robot.connection.port = bot.port

Now our robot's ready, and we can add it to Cylon's collection of robots.

      Cylon.robot robot

And now that our robots have all been set up, we can start them all at once:

    Cylon.start()
