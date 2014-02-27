require("./process");

var bluetooth,
    scan = require("./scan"),
    os = require('os');

bluetooth = {
  pair: function(hciX, address) {
    var process = new Cylon.Process,
        platform = os.platform();

    switch (platform) {
      case 'linux':
        process.spawn('bluez-simple-agent', [hciX, address]);
        break;
      case 'darwin':
        console.log("OS X manages Bluetooth pairing itself.");
        break;
      default:
        console.log("OS not yet supported.");
    }
  },

  unpair: function(hciX, address) {
    var process = new Cylon.Process,
        platform = os.platform();

    switch (platform) {
      case 'linux':
        process.spawn('bluez-simple-agent', [hciX, address, 'remove']);
        break;
      case 'darwin':
        console.log("OS X manages Bluetooth unpairing itself.");
        break;
      default:
        console.log("OS not yet supported.");
    }
  },

  connect: function(dev, address) {
    var process = new Cylon.Process,
        platform = os.platform();

    switch (platform) {
      case 'linux':
        process.spawn('sudo', ['rfcomm', 'connect', dev, address, '1']);
        break;
      case 'darwin':
        console.log("OS X manages binding itself.");
        break;
      default:
        console.log("OS not yet supported");
    }
  },

  scan: function() {
    scan('bluetooth');
  }
};

module.exports = bluetooth;
