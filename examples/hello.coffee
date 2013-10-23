cylon = require('..')

cylon.robot
  work: ->
    every 1.second(), ->
      Logger.info("hello, human!")

.start()
