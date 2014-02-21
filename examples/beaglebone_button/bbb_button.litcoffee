# Beaglebone Button

First, let's import Cylon:		

		Cylon = require('../..')

Now that we have Cylon imported, we can start defining our robot

		# Initialize the robot
		Cylon.robot

Let's define the connections and devices:

		  connection:
		    name: 'beaglebone', adaptor: 'beaglebone'

		  devices:
		    [
		      {name: 'led', driver: 'led', pin: 'P9_12'},
		      {name: 'button', driver: 'button', pin: 'P9_14'}
		    ]

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

		  work: (my) ->
		    my.button.on 'push', () -> my.led.toggle()

Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:

		.start()
