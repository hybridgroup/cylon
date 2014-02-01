require "./cylon-process"
os = require('os')

scan = (type) ->
  cylonProcess = new Cylon.CylonProcess
  switch(os.platform())
    when 'linux'
      switch(type)
        when 'serial'
          cylonProcess.exec('dmesg | grep tty')
        when 'bluetooth'
          cylonProcess.exec('hcitool scan')
        when 'usb'
          cylonProcess.exec('lsusb')
        else
          console.log('Device type not yet supported...\n')
    when 'darwin'
      cylonProcess.exec('ls /dev/tty.*')
    else
      console.log('OS not yet supported...\n')

module.exports = scan
