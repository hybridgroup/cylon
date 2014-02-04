require "./process"
os = require('os')

scan = (type) ->
  process = new Cylon.Process
  platform = os.platform()

  switch platform
    when 'linux'
      switch type
        when 'serial'
          process.exec "dmesg | grep tty"

        when 'bluetooth'
          process.exec "hcitool scan"

        when 'usb'
          process.exec "lsusb"

        else
          console.log "Device type not yet supported."

    when 'darwin'
      process.exec "ls /dev/{tty,cu}.*"

    else
      console.log "OS not yet supported."

module.exports = scan
