require '../dist/sf-client'
Cylon = require('..')

class SalesForceRobot

  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  setupSF: ->
    new Cylon.SF.SFClient(sfuser: sfuser, sfpass: sfpass, orgCredentials: orgCreds)

  sfCreds:
    {
      sfuser: "edgarsilva@hybridgroup.com"
      sfpass: "password1232YOQR0HQMpQ5f74msKqaPuCD6"
      orgCredentials: {
        clientId: '3MVG9A2kN3Bn17huqBLyrtmQ9Cgwc.FjKA4769ApTRhNNjgKEetcGv23W97cJQ3ER3VXxzyREIaD0Bp1Or8ou'
        clientSecret: '6079348238616906521'
        redirectUri: 'http://localhost:3000/oauth/_callback'
      }
    }

  work: (me) ->
    color = 0x00FF00
    bitFilter = 0xFFFF00

    me.sf = me.setupSF()

    mw.sf.authenticate((msg) =>
      @spheroRoll(0x00FF00)
    )

    me.sphero.on('connect', ->
      Logger.info('Setting up Collision Detection...')
      me.sphero.detectCollisions()
      me.sphero.stop()
      @spheroRoll(0x00FF00)
    )

    me.sphero.on 'collision', (data) ->
      Logger.info 'collision:'
      me.sphero.setRGB(0xFF0000)
      me.sphero.stop()
      console.log("Collision Data:")
      console.log(data)
      toSend = "{ \"identifier\" :\"#{ me.name }\", \"msg\": \"#{ data }\" }"
      @sf.psh(toSend)

  spheroRoll: (color) ->
    me.sphero.setRGB(color)
    me.sphero.roll 90, Math.floor(Math.random() * 360)

robot = new SalesForceRobot

Cylon.robot robot

Cylon.start()
