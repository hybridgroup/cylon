var ChildProcess = require('./child_process'),
    os = require('os');

var connectToSerial = function(dev, address) {
  switch(os.platform()){
  case 'linux':
    ChildProcess.spawn('sudo', ['rfcomm', 'connect', dev, address, '1']);
    break;
  case 'darwin':
    console.log('OSX binds devices on its own volition...\n')
    break;
  default:
    console.log('OS not yet supported...\n')
    break;
  }
}

module.exports = connectToSerial;
