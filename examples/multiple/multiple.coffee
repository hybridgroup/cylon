Cylon = require '../..'

bots = [
  { name: 'Huey' },
  { name: 'Dewey' },
  { name: 'Louie' }
]

class ChattyRobot
  connection: { name: 'loopback', adaptor: 'loopback' }
  device: { name: 'ping', driver: 'ping' }

  hello: (my) ->
    Logger.info "#{my.name}: #{my.ping.ping()}"

  work: (my) ->
    every 1.seconds(), ->
      my.hello(my)

for bot in bots
  robot = new ChattyRobot
  robot.name = bot.name
  Cylon.robot robot

Cylon.start()
