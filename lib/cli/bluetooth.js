var os = require('os'),
    namespace = require('node-namespace');

namespace("Cylon.CLI", function() {
  this.Bluetooth = (function() {
    function Bluetooth() {
      this.process = new Cylon.Process();
      this.platform = os.platform();
    }

    Bluetooth.prototype.pair = function(hciX, address) {
      switch (this.platform) {
        case 'linux':
          this.process.spawn('bluez-simple-agent', [hciX, address]);
          break;
        case 'darwin':
          console.log("OS X manages Bluetooth pairing itself.");
          break;
        default:
          console.log("OS not yet supported.");
      }
    };

    Bluetooth.prototype.unpair = function(hciX, address) {
      switch (this.platform) {
        case 'linux':
          this.process.spawn('bluez-simple-agent', [hciX, address, 'remove']);
          break;
        case 'darwin':
          console.log("OS X manages Bluetooth unpairing itself.");
          break;
        default:
          console.log("OS not yet supported.");
      }
    };

    Bluetooth.prototype.connect = function(dev, address) {
      switch (this.platform) {
        case 'linux':
          this.process.spawn('sudo', ['rfcomm', 'connect', dev, address, '1']);
          break;
        case 'darwin':
          console.log("OS X manages binding itself.");
          break;
        default:
          console.log("OS not yet supported");
      }
    };

    Bluetooth.prototype.scan = function() {
      var scan = new Cylon.CLI.Scan();
      scan.bluetooth();
    };

    return Bluetooth;

  })();
});
