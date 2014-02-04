require "./process"
os = require 'os'

connectToSerial = (dev, address) ->
  process = new Cylon.Process
  platform = os.platform()

  switch platform
    when 'linux'
      process.spawn 'sudo', ['rfcomm', 'connect', dev, address, '1']

    when 'darwin'
      console.log "OS X manages binding itself."

    else
      console.log "OS not yet supported"

module.exports = connectToSerial
