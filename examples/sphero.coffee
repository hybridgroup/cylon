Cylon = require '..'

Cylon.robot
  connection:
    name: 'Sphero', adaptor: 'sphero', port: '/dev/Sphero-RPB'

  work: ->
    every 2.seconds(), -> Logger.info "Required cylon-sphero adaptor!"

.start()
