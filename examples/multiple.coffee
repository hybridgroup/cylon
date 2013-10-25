Cylon = require '..'

bots = [
  { name: 'Huey' },
  { name: 'Dewey' },
  { name: 'Louie' }
]

class ChattyRobot
  connection:
    name: 'loopback', adaptor: 'loopback'

  device:
    name: 'ping', driver: 'ping'

  work: (my) ->
    every 1.seconds(), ->
      Logger.info "#{my.name}: #{my.ping.ping()}"

for bot in bots
  robot = new ChattyRobot
  robot.name = bot.name
  Cylon.robot robot

Cylon.start()
