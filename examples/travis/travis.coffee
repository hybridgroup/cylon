Cylon = require '../..'
Travis = require 'travis-ci'

travis = new Travis
  version: '2.0.0'

BLUE = 0x0000ff
GREEN = 0x00ff00
RED = 0xff0000

Cylon.robot
  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  work: (me) ->
    user = "hybridgroup"
    name = "cylon"

    me.checkTravis = ->
      console.log "Checking repo #{user}/#{name}"
      me.sphero.setRGB BLUE, true

      travis.repos {
        owner_name: user,
        name: name
      }, (err, res) ->
        if res.repo
          switch res.repo.last_build_state
            when 'passed' then me.sphero.setRGB(GREEN, true)
            when 'failed' then me.sphero.setRGB(RED, true)
            else me.sphero.setRGB(BLUE, true)
        else
          me.sphero.setRGB BLUE, true

    me.checkTravis()

    every 10.seconds(), ->
      me.checkTravis()

.start()
