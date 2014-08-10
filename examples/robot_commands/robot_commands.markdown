# Robot Commands

This example demonstrates a feature of the Cylon API: running arbitrary commands
on robots over HTTP. To demonstrate this, we're going to make a basic robot,
with a custom command. This in and of itself is nothing to write home about, but
you'll be able to trigger the custom command by visiting this URL in your
browser:

```
http://localhost:8080/robots/frankie/commands/relax
```

First, let's make sure to load up Cylon:

    var Cylon = require('../..');

Now that we've got that, let's set up the api:

    Cylon.api();

And with that done let's define our robot:

    Cylon.robot({
      name: 'Frankie',

The result of this method will be returned to the HTTP client as part of a JSON
object.

      sayRelax: function() {
        return this.name + " says relax");
      },

Since we don't really care what actual work this robot does, but need to keep it
busy, we'll just tell it to print it's name every five seconds.

      work: function(my) {
        every((5).seconds(), function() {
          console.log(my.sayRelax());
        });
      },

We'll then set up the `commands` object, which tells the API which commands the
Robot has should be publically accessible:

      commands: function() {
        return {
          say_relax: this.sayRelax
        };
      }
    });

And now that all the pieces are in place, we can start up Cylon:

    Cylon.start();

Now the robot will print it's name to the console, and Cylon will serve an API
to `localhost:8080`. Check it out!.
