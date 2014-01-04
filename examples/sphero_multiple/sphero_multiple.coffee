Cylon = require '../..'

class SpheroRobot
  connection: { name: 'Sphero', adaptor: 'sphero' }
  device: { name: 'sphero', driver: 'sphero' }

  work: (my) ->
    every 1.seconds(), ->
      console.log my.name
      my.sphero.setRandomColor()
      my.sphero.roll 60, Math.floor(Math.random() * 360)

bots = [
  { name: "Thelma", port: "/dev/rfcomm0" },
  { name: "Louise", port: "/dev/rfcomm1" }
]

for bot in bots
  robot = new SpheroRobot

  robot.name = bot.name
  robot.connection.port = bot.port

  Cylon.robot robot

Cylon.start()
