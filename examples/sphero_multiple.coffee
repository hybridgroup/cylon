Cylon = require '..'

bots = [
  { port: '/dev/rfcomm0', name: 'Thelma' },
  { port: '/dev/rfcomm1', name: 'Louise' }
]

SpheroRobot =
  connection:
    name: 'Sphero', adaptor: 'sphero'

  device:
    name: 'sphero', driver: 'sphero'

  work: (self) ->
    color = 0x000050
    every 1.second(), ->
      #me.sphero.roll(60, Math.floor(Math.random() * 360), 1)
      Logger.info self.name
      self.sphero.setRGB(color, true)
      color += 0x005000
      color = 0x000050 if color > 0xFFFFFF

for bot in bots
  robot = Object.create(SpheroRobot)
  robot.connection.port = bot.port
  robot.name = bot.name

  Cylon.robot robot

Cylon.start()
