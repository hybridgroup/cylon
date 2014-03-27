# Master

For this example, we're going to provide a simple demonstration of how Cylon's
master functionality works. Cylon can be fed an arbitrary number of robots, and
it will then take care of all of them, starting and stopping all of them as
needed.

First, let's load up Cylon:

    var Cylon = require('../..');

With that in place, now we can start defining our robots. They'll all behave
similarly, but have unique characteristics (their name), so let's
define an array to hold these names for now. Later, we can instantiate
a base robot and change it's attributes as needed.

    var bots = [ 'Huey', 'Dewey', 'Louie' ];

Now we can define our `MinionBot` class. This will be the base
class for all three of the robots.

    var MinionBot = (function() {
      function MinionBot() {};

We'll just give our robots some basic work so we can tell they're actually
working:

      MinionBot.prototype.work = function(my) {
        console.log("Robot " + my.name + " is now working!");
      };

      return MinionBot;

    })();

And that's all we need for that.

Next up, we'll create Cylon robots by making an instance of the `MinionBot`
class, and modifying the attributes that are unique to each robot. After the
customized robot is ready, we'll feed it into Cylon.

    for (var i = 0; i < bots.length; i++) {
      var robot = new MinionBot;
      robot.name = bots[i];
      Cylon.robot(robot);
    }

And now Cylon knows about all the robots we care about for this example, and
what they do. All that's left is to start them all. The `.start()` method on
Cylon triggers the `.start()` command on all the robots we've told Cylon about,
so all three robots will start at once.

    Cylon.start();
