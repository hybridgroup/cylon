Cylon = require '..'

bots = [
  { port: '/dev/rfcomm0', name: 'Thelma' }
#  { port: '/dev/rfcomm1', name: 'Louise' },
#  { port: '/dev/rfcomm2', name: 'Grace' },
#  { port: '/dev/rfcomm3', name: 'Ada' }
]

Green = 0x0000FF
Red = 0xFF0000

class ConwayRobot
  connection:
    name: 'Sphero', adaptor: 'sphero'

  device:
    name: 'sphero', driver: 'sphero'

  born: ->
    @contacts = 0
    @age = 0
    this.life()
    this.move()

  move: ->
    this.sphero.roll 60, Math.floor(Math.random() * 360)

  life: ->
    @alive = true
    this.sphero.setRGB Green

  death: ->
    @alive = false
    this.sphero.setRGB Green
    this.sphero.stop()

  enoughContacts: ->
    if @contacts >= 2 and @contacts < 7
      true
    else
      false

  birthday: ->
    @age += 1
    Logger.info "Happy birthday, #{@name}. You are #{@age} and had #{@contacts} contacts."
    if this.enoughContacts()
      this.rebirth() if not @alive?
    else
      this.death()

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
