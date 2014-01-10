# Cylon and Travis

For this Cylon example, we're going to check on a Travis build every ten
seconds, and change the color of a Sphero depending on the result.

Before you run this, make sure you install the following dependencies:

- **travis-ci** (npm install travis-ci)
- **cylon-sphero** (npm install cylon-sphero)

First of all, let's load up Cylon. We're going to load the version directly from
the repo, since we're here already:

    Cylon = require '../..'

Next, we'll set up Travis. We're going to be using the very useful [travis-ci][]
module.

[travis-ci]: https://github.com/pwmckenna/node-travis-ci

    Travis = require 'travis-ci'

Now that we've got our Travis module imported, let's set it up:

    travis = new Travis
      version: '2.0.0'

Now we have a working interface to the Travis-CI API. Let's set up a username
and repo to query Travis about later, as long as we're here. Feel free to change
these if you want to try with your own repositories.

    user = "hybridgroup"
    name = "cylon"

## Robot

And with that last bit of setup done, let's start setting up our robot!

    Cylon.robot

We use a connection to tell Cylon what port it can use to communicate with our
Sphero, along with what adaptor it should require (`cylon-sphero`) to connect to
it. We give it a name to make it easier to reference later on.

      connection:
        name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

Devices are set up in a similar fashion, but allow us to directly issue commands
to the sphero. These are added to the robot's namespace directly to make them
easy to access.

      device:
        name: 'sphero', driver: 'sphero'

Now that we've told our robot what hardware it has access to, we can start
telling it what it should do. The work function passes along one argument,
a reference to the robot so we can access it's state and hardware.

      work: (me) ->

We'll define a function to check Travis and change the Sphero's color depending
on the state of the last build.

        checkTravis = ->

First, it will log that it's checking Travis to the logger:

          console.log "Checking last build status for #{user}/#{name}"

Let's set the default color of the Sphero to blue until we know what the build
status is:

          me.sphero.setColor 'blue', true

Now we'll fetch the Travis build status:

          travis.repos {
            owner_name: user
            name: name
          }, (err, res) ->

If we were returned a response, we'll check the status of the build and use that
to determine what color we should make the Sphero.

            if res.repo
              switch res.repo.last_build_state

When the build state is passed, then we'll set the Sphero's color to green:

                when 'passed' then me.sphero.setColor 'green', true

And if the build has failed, let's set the Sphero's color to red:

                when 'failed' then me.sphero.setColor 'red', true

Otherwise, we'll just set it to blue:

                else me.sphero.setColor 'blue', true

And if we didn't get a response from the server, let's just set it to blue.

            else me.sphero.setColor 'blue', true

Now that we've got that function defined, let's call it to set the initial color
of the Sphero:

        do checkTravis

And every ten seconds, let's keep checking Travis:

        every 10.seconds(), ->
          do checkTravis

And now that we've got our work defined, let's start the robot!

    .start()
