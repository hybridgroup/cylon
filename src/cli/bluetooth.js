var ChildProcess = require('./child_process'),
    os = require('os');

var bluetooth = {
  pair: function(hciX, address) {
    switch(os.platform()){
    case 'linux':
      ChildProcess.spawn('bluez-simple-agent', [hciX, address]);
      break;
    case 'darwin':
      console.log('OSX pairs devices on its own volition...\n')
      break;
    default:
      console.log('OS not yet supported...\n')
      break;
    }
  },

  unpair: function(hciX, address) {
    switch(os.platform()){
    case 'linux':
      ChildProcess.spawn('bluez-simple-agent', [hciX, address, 'remove']);
      break;
    case 'darwin':
      console.log('OSX unpairs devices on its own volition...\n')
      break;
    default:
      console.log('OS not yet supported...\n')
      break;
    }
  }
}

module.exports = bluetooth;
