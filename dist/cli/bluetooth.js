(function() {
  var bluetooth, os;

  require("./cylon-process");

  os = require('os');

  bluetooth = {
    pair: function(hciX, address) {
      var cylonProcess;
      cylonProcess = new Cylon.CylonProcess;
      switch (os.platform()) {
        case 'linux':
          return cylonProcess.spawn('bluez-simple-agent', [hciX, address]);
        case 'darwin':
          return console.log('OSX pairs devices on its own volition...\n');
        default:
          return console.log('OS not yet supported...\n');
      }
    },
    unpair: function(hciX, address) {
      var cylonProcess;
      cylonProcess = new Cylon.CylonProcess;
      switch (os.platform()) {
        case 'linux':
          return cylonProcess.spawn('bluez-simple-agent', [hciX, address, 'remove']);
        case 'darwin':
          return console.log('OSX unpairs devices on its own volition...\n');
        default:
          return console.log('OS not yet supported...\n');
      }
    }
  };

  module.exports = bluetooth;

}).call(this);
