Cylon = require('..')

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

  work: (me) ->
    me.salesforce.on('start', () ->
      me.salesforce.subscribe('/topic/SpheroMsgOutbound', (data) ->
        spheroName = data.sobject.Sphero_Name__c
        bucks = data.sobject.Bucks__c
        Logger.info "Sphero: #{ spheroName }, data Bucks: #{ bucks }, SM_Id: #{ data.sobject.Id }"
        me.master.findRobot(spheroName, (err, spheroBot) ->
          spheroBot.react(spheroBot.devices.sphero)
        )
      )
    )

class SpheroRobot
  totalBucks: 0

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
      me.sphero.setRGB(0x0000FF, me)
      me.sphero.stop()
      toSend = "{ \"spheroName\" :\"#{ me.name }\", \"bucks\": \"#{ me.totalBucks++ }\" }"
      me.master.findRobot('salesforce', (err, sf) ->
        sf.devices.salesforce.push('SpheroController', 'POST', toSend)
      )

sfRobot = new SalesforceRobot()
sfRobot.name = "salesforce"
Cylon.robot sfRobot

spheroRobot = new SpheroRobot()
spheroRobot.name = 'ROY'
spheroRobot.connection.port = '/dev/rfcomm0'
Cylon.robot spheroRobot

Cylon.start()
