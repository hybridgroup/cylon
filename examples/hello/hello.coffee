Cylon = require '../..'

Cylon.robot
  work: ->
    every 1.second(), ->
      Logger.info("Hello, human!")

    after 10.seconds(), ->
      Logger.info "Impressive."

.start()
