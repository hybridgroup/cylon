require "./process"
scan = require "./scan"
os = require('os')

bluetooth =
  pair: (hciX, address) ->
    process = new Cylon.Process
    platform = os.platform()

    switch platform
      when 'linux'
        process.spawn 'bluez-simple-agent', [hciX, address]

      when 'darwin'
        console.log "OS X manages Bluetooth pairing itself."

      else
        console.log "OS not yet supported."

  unpair: (hciX, address) ->
    process = new Cylon.Process
    platform = os.platform()

    switch platform
      when 'linux'
        process.spawn 'bluez-simple-agent', [hciX, address, 'remove']

      when 'darwin'
        console.log "OS X manages Bluetooth unpairing itself."

      else
        console.log "OS not yet supported."

  scan: () ->
    scan('bluetooth')

module.exports = bluetooth
