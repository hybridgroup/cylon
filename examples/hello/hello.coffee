Cylon = require '../..'

Cylon.robot
  work: ->
    every 1.second(), ->
      console.log("Hello, human!")

    after 10.seconds(), ->
      console.log "Impressive."

.start()
