var ChildProcess = require('./child_process'),
    sys = require('sys'),
    os = require('os');

var scan = function(type) {
  switch(os.platform()){
  case 'linux':
    switch(type){
    case 'serial':
      ChildProcess.exec('ls /dev/tty*');
      break;
    case 'bluetooth':
      ChildProcess.exec('hcitool scan');
      break;
    case 'usb':
      ChildProcess.exec('lsusb');
      break;
    default:
      sys.print('Device type not yet supported...\n')
    }
    break;
  case 'darwin':
    ChildProcess.exec('ls /dev/tty*');
    break;
  default:
    sys.print('OS not yet supported...\n')
    break;
  }
}

module.exports = scan;
