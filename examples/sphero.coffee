Cylon = require('..').instance()

Cylon.robot
  connection:
    name: 'Sphero', adaptor: 'sphero'

  work: ->
    every 2.seconds(), -> Logger.info "Required cylon-sphero adaptor!"

.start()
