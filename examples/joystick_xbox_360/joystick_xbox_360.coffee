Cylon = require '../..'

Cylon.robot
  connection: { name: 'joystick', adaptor: 'joystick', controller: 'xbox360' }
  device: { name: 'controller', driver: 'xbox360' }

  work: (my) ->
    ["a", "b", "x", "y"].forEach (button) ->
      my.controller.on "#{button}:press", ->
        console.log "Button #{button} pressed."

      my.controller.on "#{button}:release", ->
        console.log "Button #{button} released."

    lastPosition =
      left: { x: 0, y: 0 }
      right: { x: 0, y: 0 }

    my.controller.on "left:move", (pos) ->
      last = lastPosition.left
      unless pos.x is last.x and pos.y is last.y
        console.log "Left Stick:", pos

    my.controller.on "right:move", (pos) ->
      last = lastPosition.right
      unless pos.x is last.x and pos.y is last.y
        console.log "Right Stick:", pos

Cylon.start()
