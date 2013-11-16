Cylon = require('..')

Cylon.api host: '0.0.0.0', port: '8080'

bots = [
  { port: '/dev/rfcomm0', name: 'sphero-roy' },
  { port: '/dev/rfcomm1', name: 'sphero-gpg' }
  { port: '', name: 'salesforce' },
  { port: '', name: 'pebble' }
]

class PebbleRobot
  connection:
    name: 'pebble', adaptor: 'pebble'
  device:
    name: 'pebble', driver: 'pebble'
  work: (me) ->
    me.pebble.on('connect', ->
      console.log('connected!')
    )

class SalesforceRobot
  connection:
    name: 'sfcon',
    adaptor: 'force',
    sfuser: "edgarsilva@hybridgroup.com",
    sfpass: "password1232YOQR0HQMpQ5f74msKqaPuCD6",
    orgCreds: {
      clientId: '3MVG9A2kN3Bn17huqBLyrtmQ9Cgwc.FjKA4769ApTRhNNjgKEetcGv23W97cJQ3ER3VXxzyREIaD0Bp1Or8ou',
      clientSecret: '6079348238616906521',
      redirectUri: 'http://localhost:3000/oauth/_callback'
    }

  device:
    name: 'salesforce', driver: 'force'

  work: (me) ->

    me.salesforce.on('start', () ->
      me.salesforce.subscribe('/topic/SpheroMsgOutbound', (data) ->
        spheroName = data.sobject.Sphero_Name__c
        Logger.info "Sphero: #{ spheroName }, data Content: #{ data.sobject.Content__c }, SM_Id: #{ data.sobject.Id }"
        me.master.findRobot(spheroName, (err, spheroBot) ->
          spheroBot.devices.sphero.setRGB(0x00FF00)
          spheroBot.devices.sphero.roll 90, Math.floor(Math.random() * 360)
        )
        me.master.findRobot('pebble', (error, robot) ->
          robot.devices.pebble.message_queue().push(spheroName)
        )
      )
    )

class SpheroRobot
  connection:
    name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'

  device:
    name: 'sphero', driver: 'sphero'

  work: (me) ->

    me.sphero.on 'connect', ->
      Logger.info('Setting up Collision Detection...')
      me.sphero.detectCollisions()
      me.sphero.stop()
      me.sphero.setRGB(0x00FF00)
      me.sphero.roll 90, Math.floor(Math.random() * 360)

    me.sphero.on 'collision', (data) ->
      me.sphero.setRGB(0xFF0000, me)
      me.sphero.stop()
      toSend = "{ \"identifier\" :\"#{ me.name }\", \"msg\": \"#{ 'Collision detected' }\" }"
      me.master.findRobot('salesforce', (err, sf) ->
        sf.devices.salesforce.push('SpheroController', 'POST', toSend)
      )

for bot in bots
  switch bot.name
    when 'salesforce'
      robot = new SalesforceRobot
    when 'pebble'
      robot = new PebbleRobot
    else
      robot = new SpheroRobot
  robot.connection.port = bot.port
  robot.name = bot.name
  console.log("Name: #{ robot.name }")
  Cylon.robot robot

Cylon.start()
