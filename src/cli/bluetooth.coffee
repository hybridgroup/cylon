require "./cylon-process"
os = require('os')

bluetooth =
  pair: (hciX, address) ->
    cylonProcess = new Cylon.CylonProcess
    switch(os.platform())
      when 'linux'
        cylonProcess.spawn('bluez-simple-agent', [hciX, address])
      when 'darwin'
        console.log('OSX pairs devices on its own volition...\n')
      else
        console.log('OS not yet supported...\n')

  unpair: (hciX, address) ->
    cylonProcess = new Cylon.CylonProcess
    switch(os.platform())
      when 'linux'
        cylonProcess.spawn('bluez-simple-agent', [hciX, address, 'remove'])
      when 'darwin'
        console.log('OSX unpairs devices on its own volition...\n')
      else
        console.log('OS not yet supported...\n')

module.exports = bluetooth
