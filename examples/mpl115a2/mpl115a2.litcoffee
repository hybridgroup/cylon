# MPL115A2

First, let's import Cylon:

		Cylon = require '../..'

Now that we have Cylon imported, we can start defining our robot

		Cylon.robot

Let's define the connections and devices:

		  connection:
		    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

		  device:
		    name: 'mpl115a2', driver: 'mpl115a2'

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

		  work: (my) ->
		    my.mpl115a2.on 'start', ->
		      my.mpl115a2.getTemperature((data) ->
		        Logger.info "temperature #{data['temperature']}, pressure #{data['pressure']}"
		      )

Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:

		.start()
