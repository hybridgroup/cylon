var ChildProcess = require('./child_process'),
    sys = require('sys'),
    os = require('os');

var connectToSerial = function(dev, address) {
  switch(os.platform()){
  case 'linux':
    ChildProcess.exec('sudo rfcomm connect ' + dev + ' ' + address + ' 1');
    break;
  case 'darwin':
    sys.print('OSX binds devices on its own volition...\n')
    break;
  default:
    sys.print('OS not yet supported...\n')
    break;
  }
}

module.exports = connectToSerial;
