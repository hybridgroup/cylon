Cylon = require '../..'

bots = [
  { port: '/dev/rfcomm0', name: 'Thelma' }
  { port: '/dev/rfcomm1', name: 'Louise' },
  { port: '/dev/rfcomm2', name: 'Grace' },
  { port: '/dev/rfcomm3', name: 'Ada' }
]

Green = 0x0000FF
Red = 0xFF0000

class ConwayRobot
  connection: { name: 'Sphero', adaptor: 'sphero' }
  device: { name: 'sphero', driver: 'sphero' }

  born: ->
    @contacts = 0
    @age = 0
    @life()
    @move()

  move: ->
    @sphero.roll 60, Math.floor(Math.random() * 360)

  life: ->
    @alive = true
    @sphero.setRGB Green

  death: ->
    @alive = false
    @sphero.setRGB Red
    @sphero.stop()

  enoughContacts: ->
    if @contacts >= 2 and @contacts < 7 then true else false

  birthday: ->
    @age += 1

    console.log "Happy birthday, #{@name}. You are #{@age} and had #{@contacts} contacts."

    if @enoughContacts()
      @rebirth() if not @alive?
    else
      @death()

    @contacts = 0

  work: (me) ->
    me.born()

    me.sphero.on 'collision', ->
      @contacts += 1

    every 3.seconds(), ->
      me.move() if me.alive?

    every 10.seconds(), ->
      me.birthday() if me.alive?

for bot in bots
  robot = new ConwayRobot
  robot.connection.port = bot.port
  robot.name = bot.name
  Cylon.robot robot

Cylon.start()
