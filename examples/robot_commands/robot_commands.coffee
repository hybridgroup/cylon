Cylon = require '../..'

Cylon.api host: '0.0.0.0', port: '8080'

class MyRobot
  commands: ["relax"]

  relax: ->
    "#{this.name} says relax"

  work: (me) ->
    every 1.seconds(), ->
      console.log me.name

robot = new MyRobot
robot.name = "frankie"
Cylon.robot robot

Cylon.start()
