Cylon = require '..'

bots = [
  { port: '/dev/cu.Sphero-RGB', name: 'Huey' },
  { port: '/dev/cu.Sphero-GRB', name: 'Dewey' },
  { port: '/dev/cu.Sphero-BRG', name: 'Louie' }
]

SpheroRobot =
  connection:
    name: 'Sphero', adaptor: 'sphero'

  work: (self) ->
    console.log "Robot #{self.name} is now working!"

for bot in bots
  robot = Object.create(SpheroRobot)
  robot.connection.port = bot.port
  robot.name = bot.name

  Cylon.robot robot

Cylon.start()
