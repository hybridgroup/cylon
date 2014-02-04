require "./process"
os = require('os')

connectToSerial = (dev, address) ->
  cylonProcess = new Cylon.Process
  switch(os.platform())
    when 'linux'
      cylonProcess.spawn('sudo', ['rfcomm', 'connect', dev, address, '1'])
    when 'darwin'
      console.log('OSX binds devices on its own volition...\n')
    else
      console.log('OS not yet supported...\n')

module.exports = connectToSerial
