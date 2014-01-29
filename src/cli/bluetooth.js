var ChildProcess = require('./child_process'),
    sys = require('sys'),
    os = require('os');

var bluetooth = {
  pair: function(hciX, address) {
    switch(os.platform()){
    case 'linux':
      ChildProcess.spawn('bluez-simple-agent', [hciX, address]);
      break;
    case 'darwin':
      sys.print('OSX pairs devices on its own volition...\n')
      break;
    default:
      sys.print('OS not yet supported...\n')
      break;
    }
  },

  unpair: function(hciX, address) {
    switch(os.platform()){
    case 'linux':
      ChildProcess.spawn('bluez-simple-agent', [hciX, address, 'remove']);
      break;
    case 'darwin':
      sys.print('OSX unpairs devices on its own volition...\n')
      break;
    default:
      sys.print('OS not yet supported...\n')
      break;
    }
  }
}

module.exports = bluetooth;
