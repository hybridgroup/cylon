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
      Logger.info 'connected!'
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
        bucks = data.sobject.Bucks__c
        Logger.info "Sphero: #{ spheroName }, data Bucks: #{ bucks }, SM_Id: #{ data.sobject.Id }"
        me.master.findRobot(spheroName, (err, spheroBot) ->
          spheroBot.react(spheroBot.devices.sphero)
        )
        me.spheroReport[spheroName] = bucks
        toPebble = ""
        for key, val of me.spheroReport
          toPebble += "#{key}: $#{val}\n"
        me.master.findRobot('pebble', (error, pebbleBot) ->
          pebbleBot.message(pebbleBot.devices.pebble, toPebble)
        )
      )
    )
 
class SpheroRobot
  totalBucks: 1
  payingPower: true
 
  connection:
    name: 'sphero', adaptor: 'sphero'
 
  device:
    name: 'sphero', driver: 'sphero'
 
  react: (device) ->
    device.setRGB(0x00FF00)
    device.roll 90, Math.floor(Math.random() * 360)
    this.payingPower = true
 
  bankrupt: () ->
    every 3.seconds(), () =>
      if this.payingPower and this.totalBucks > 0
        this.totalBucks += -1
        if @totalBucks == 0
          this.sphero.setRGB(0xFF000)
          this.sphero.stop()
 
  changeDirection: () ->
    every 1.seconds(), () =>
      this.sphero.roll 90, Math.floor(Math.random() * 360) if @payingPower
 
  work: (me) ->
 
    me.sphero.on 'connect', ->
      Logger.info('Setting up Collision Detection...')
      me.sphero.detectCollisions()
      me.sphero.stop()
      me.sphero.setRGB(0x00FF00)
      me.sphero.roll 90, Math.floor(Math.random() * 360)
      me.bankrupt()
      me.changeDirection()
 
    me.sphero.on 'collision', (data) ->
      me.sphero.setRGB(0x0000FF)
      me.sphero.stop()
      me.payingPower = false
      toSend = "{ \"spheroName\" :\"#{ me.name }\", \"bucks\": \"#{ me.totalBucks++ }\" }"
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
  { port: '/dev/tty.Sphero-ROY-AMP-SPP', name: 'ROY' },
  { port: '/dev/tty.Sphero-GBO-AMP-SPP', name: 'GBO'},
  { port: '/dev/tty.Sphero-RRY-AMP-SPP', name: 'RRY'}
]
 
for bot in bots
  robot = new SpheroRobot
  robot.connection.port = bot.port
  robot.name = bot.name
  Cylon.robot robot
 
Cylon.start()
