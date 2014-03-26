# Hello

For this exceedingly simple example, we're going to define a robot that has no
devices, no connections, and just demonstrates the tools for performing work on
an interval, and after a timeout.

Let's start by importing Cylon:

    Cylon = require '../..'

Now we can define our robot:

    Cylon.robot

For work, it's going to print a message to the console every second, and another
message after ten seconds have elapsed.

      work: ->
        every 1.second(), ->
          console.log("Hello, human!")

        after 10.seconds(), ->
          console.log "Impressive."

Simple as can be. Now that we're done, let's start the robot:

    .start()
