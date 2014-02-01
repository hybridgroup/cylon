var ChildProcess = require('./child_process'),
    os = require('os');

var scan = function(type) {
  switch(os.platform()){
  case 'linux':
    switch(type){
    case 'serial':
      ChildProcess.exec('dmesg | grep tty');
      break;
    case 'bluetooth':
      ChildProcess.exec('hcitool scan');
      break;
    case 'usb':
      ChildProcess.exec('lsusb');
      break;
    default:
      console.log('Device type not yet supported...\n')
    }
    break;
  case 'darwin':
    ChildProcess.exec('ls /dev/tty.*');
    break;
  default:
    console.log('OS not yet supported...\n')
    break;
  }
}

module.exports = scan;
