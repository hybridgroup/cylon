Cylon = require '../..'

Cylon.robot
  connection: { name: 'joystick', adaptor: 'joystick', controller: 'dualshock3' }
  device: { name: 'controller', driver: 'dualshock3' }

  work: (my) ->
    ["square", "circle", "x", "triangle"].forEach (button) ->
      my.controller.on "#{button}:press", ->
        console.log "Button #{button} pressed."

      my.controller.on "#{button}:release", ->
        console.log "Button #{button} released."

    my.controller.on "left:move", (pos) ->
      console.log "Left Stick:", pos

    my.controller.on "right:move", (pos) ->
      console.log "Right Stick:", pos

Cylon.start()
