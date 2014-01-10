# Master

For this example, we're going to provide a simple demonstration of how Cylon's
master functionality works. Cylon can be fed an arbitrary number of robots, and
it will then take care of all of them, starting and stopping all of them as
needed.

For this example, we're going to be using three Spheros, but you don't actually
need the hardware for the example to work. Do make sure you have the
`cylon-sphero` module installed, though.

First, let's load up Cylon

    Cylon = require '../..'

With that in place, now we can start defining our robots. They'll all behave
similarly, but have unique characteristics (their name and port), so let's
define an array of objects to hold these differences. Later, we can instantiate
a base robot and change it's attributes as needed.

    bots = [
      { port: '/dev/cu.Sphero-RGB', name: 'Huey' },
      { port: '/dev/cu.Sphero-GRB', name: 'Dewey' },
      { port: '/dev/cu.Sphero-BRG', name: 'Louie' }
    ]

Now we can define our cleverly-named `SpheroRobot` class. This will be the base
class for all three of the robots.

    class SpheroRobot

Every robot needs to connect to a Sphero. We're doing this using the
`cylon-sphero` adaptor.

      connection: { name: 'Sphero', adaptor: 'sphero' }

We'll just give our robots some basic work so we can tell they're actually
working:

      work: (my) ->
        console.log "Robot #{my.name} is now working!"

And that's all we need for that.

Next up, we'll create Cylon robots by making an instance of the `SpheroRobot`
class, and modifying the attributes that are unique to each robot. After the
customized robot is ready, we'll feed it into Cylon.

    for bot in bots
      robot = new SpheroRobot
      robot.connection.port = bot.port
      robot.name = bot.name

      Cylon.robot robot

And now Cylon knows about all the robots we care about for this example, and
what they do. All that's left is to start them all. The `.start()` method on
Cylon triggers the `.start()` command on all the robots we've told Cylon about,
so all three robots will start at once.

    Cylon.start()
