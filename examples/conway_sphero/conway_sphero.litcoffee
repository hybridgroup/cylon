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

    Cylon = require '../..'

We'll be using four robots for this example, but they'll have very similar
programming so we just need to define what's different between them for now.
Each of the robots will have a unique name, and will communicate on their own
port.

    bots = [
      { port: '/dev/rfcomm0', name: 'Thelma' }
      { port: '/dev/rfcomm1', name: 'Louise' },
      { port: '/dev/rfcomm2', name: 'Grace' },
      { port: '/dev/rfcomm3', name: 'Ada' }
    ]

For easier use later, let's define the colors we'll be using with the Spheros,
green for alive and red for dead:

    Green = 0x0000FF
    Red = 0xFF0000

That gets the basics out of the way.

Since, as previously mentioned, our robots all have the same basic
functionality, we can define that functionality in a CoffeeScript class. Since
we're feeling particularly creative today, let's call this class `ConwayRobot`:

    class ConwayRobot

All of our robots will be connecting to a Sphero, and be operating via a single
device (you guessed it, a Sphero).

      connection: { name: 'Sphero', adaptor: 'sphero' }
      device: { name: 'sphero', driver: 'sphero' }

When the robots are first started, they are born. This sets their contacts to
zero, their age to zero, makes them "alive", and starts them moving for the
first tick.

      born: ->
        @contacts = 0
        @age = 0
        @life()
        @move()

When a robot is asked to move, it rolls in a random direction at speed 60.

      move: ->
        @sphero.roll 60, Math.floor(Math.random() * 360)

In the case of our robots, "life" just means the robot's internal "alive" state
is set to `true`, and the Sphero's LED is set to green.

      life: ->
        @alive = true
        @sphero.setRGB Green

Similarly, "death" just sets the "alive" state to false, the Sphero's color to
red, and stops the Sphero from moving.

      death: ->
        @alive = false
        @sphero.setRGB Red
        @sphero.stop()

A robot is decided to have enough contacts if it has between two and six
contacts.

      enoughContacts: ->
        if @contacts >= 2 and @contacts < 7 then true else false

On a robot's birthday, it increments it's age, prints it's name, age, and
contacts to the console, and then determines if it's now alive or dead based on
the number of contacts it had in the last tick.

      birthday: ->
        @age += 1

        console.log "Happy birthday, #{@name}. You are #{@age} and had #{@contacts} contacts."

        if @enoughContacts()
          @rebirth() if not @alive?
        else
          @death()

        @contacts = 0

Now that the pieces are there, we can set up our robot's work. It starts by
being "born", then moves every three seconds if it's alive, celebrates it's
birthday every ten seconds if it's alive, and increments it's contacts every
time the Sphero detects a collision.

      work: (me) ->
        me.born()

        me.sphero.on 'collision', ->
          @contacts += 1

        every 3.seconds(), ->
          me.move() if me.alive?

        every 10.seconds(), ->
          me.birthday() if me.alive?

Now that we've defined the behaviour of our Conway's Game robots, we can make
the robots themselves.

For each of the sets of unique characteristics in the earlier `bots` array,
we'll create a new `ConwayRobot`, assign it it's unique characteristics, and
pass it to Cylon so it will keep track of them.

    for bot in bots
      robot = new ConwayRobot
      robot.connection.port = bot.port
      robot.name = bot.name
      Cylon.robot robot

Now that Cylon knows about our robots and what they do, we can get started!

    Cylon.start()
