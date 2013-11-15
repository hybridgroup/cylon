require '../examples/sf-client'
Cylon = require('..')

bots = [
  { port: '/dev/rfcomm0', name: 'sphy-rgr' },
  { port: '/dev/rfcomm1', name: 'sphy-bpy' }
]

class SpheroRobot
  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  setupSF: ->
    new SF.SFClient(this.sfCreds)

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
    me.sf = me.setupSF()

    me.sphero.on('connect', ->
      Logger.info('Setting up Collision Detection...')
      me.sphero.detectCollisions()
      me.sphero.stop()
      me.sphero.setRGB(0x00FF00)
      me.sphero.roll 90, Math.floor(Math.random() * 360)
    )

    me.sphero.on 'collision', (data) ->
      #Logger.info 'collision:'
      me.sphero.setRGB(0xFF0000, me)
      me.sphero.stop()
      #console.log("Collision Data:")
      #console.log(data[0][0])
      toSend = "{ \"identifier\" :\"#{ me.name }\", \"msg\": \"#{ 'Collision detected' }\" }"
      me.sf.push(toSend)

    me.sf.authenticate((msg) =>
      #Logger.info 'SF Outbound Msg:'
      Logger.info "Sphero: #{ msg.sobject.Sphero_Name__c }, Msg Content: #{ msg.sobject.Content__c }, SM_Id: #{ msg.sobject.Id }"
      me.sphero.setRGB(0x00FF00)
      me.sphero.roll 90, Math.floor(Math.random() * 360)
    )

for bot in bots
  robot = new SpheroRobot
  robot.connection.port = bot.port
  robot.name = bot.name
  console.log("Name: #{ robot.name }")
  Cylon.robot robot

Cylon.start()
