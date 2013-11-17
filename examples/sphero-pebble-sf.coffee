Cylon = require('..')

Cylon.api host: '0.0.0.0', port: '8080'

class PebbleRobot
  connection:
    name: 'pebble', adaptor: 'pebble'

  device:
    name: 'pebble', driver: 'pebble'

  message: (robot, msg) =>
    robot.message_queue().push(msg)

  work: (me) ->
    me.pebble.on('connect', ->
      console.log('connected!')
    )

class SalesforceRobot
  connection:
    name: 'sfcon',
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN,
    orgCreds: {
      clientId: process.env.SF_CLIENT_ID,
      clientSecret: process.env.SF_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/oauth/_callback'
    }

  device:
    name: 'salesforce', driver: 'force'

  spheroReport:{}

  work: (me) ->
    me.salesforce.on('start', () ->
      me.salesforce.subscribe('/topic/SpheroMsgOutbound', (data) ->
        spheroName = data.sobject.Sphero_Name__c
        counter = data.sobject.Content__c
        Logger.info "Sphero: #{ spheroName }, data Content: #{ counter }, SM_Id: #{ data.sobject.Id }"
        me.master.findRobot(spheroName, (err, spheroBot) ->
          spheroBot.react(spheroBot.devices.sphero)
        )
        me.spheroReport[spheroName] = counter
        toPebble = ""
        for key, val of me.spheroReport
          toPebble += "#{key}: $#{val}\n"
        me.master.findRobot('pebble', (error, pebbleBot) ->
          pebbleBot.message(pebbleBot.devices.pebble, toPebble)
        )
      )
    )

class SpheroRobot
  total_collisions: 0
  connection:
    name: 'sphero', adaptor: 'sphero'

  device:
    name: 'sphero', driver: 'sphero'

  react: (robot) =>
    robot.setRGB(0x00FF00)
    robot.roll 90, Math.floor(Math.random() * 360)

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
      toSend = "{ \"identifier\" :\"#{ me.name }\", \"msg\": \"#{ me.total_collisions++ }\" }"
      me.master.findRobot('salesforce', (err, sf) ->
        sf.devices.salesforce.push('SpheroController', 'POST', toSend)
      )

sfRobot = new SalesforceRobot()
sfRobot.name = "salesforce"
Cylon.robot sfRobot
pebRobot = new PebbleRobot()
pebRobot.name = "pebble"
Cylon.robot pebRobot

bots = [
  { port: '/dev/rfcomm0', name: 'ROY' },
  { port: '/dev/rfcomm1', name: 'GPG'}
]

for bot in bots
  robot = new SpheroRobot
  robot.connection.port = bot.port
  robot.name = bot.name
  Cylon.robot robot

Cylon.start()
