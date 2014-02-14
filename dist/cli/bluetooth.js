(function() {
  var bluetooth, os, scan;

  require("./process");

  scan = require("./scan");

  os = require('os');

  bluetooth = {
    pair: function(hciX, address) {
      var platform, process;
      process = new Cylon.Process;
      platform = os.platform();
      switch (platform) {
        case 'linux':
          return process.spawn('bluez-simple-agent', [hciX, address]);
        case 'darwin':
          return console.log("OS X manages Bluetooth pairing itself.");
        default:
          return console.log("OS not yet supported.");
      }
    },
    unpair: function(hciX, address) {
      var platform, process;
      process = new Cylon.Process;
      platform = os.platform();
      switch (platform) {
        case 'linux':
          return process.spawn('bluez-simple-agent', [hciX, address, 'remove']);
        case 'darwin':
          return console.log("OS X manages Bluetooth unpairing itself.");
        default:
          return console.log("OS not yet supported.");
      }
    },
    scan: function() {
      return scan('bluetooth');
    }
  };

  module.exports = bluetooth;

}).call(this);
