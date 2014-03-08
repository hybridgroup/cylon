var os = require('os'),
    namespace = require('node-namespace');

namespace('Cylon.CLI', function() {
  this.Scan = (function() {
    function Scan() {
      this.process = new Cylon.Process();
      this.platform = os.platform();
    }

    Scan.prototype.serial = function(){
      this.search('serial');
    };

    Scan.prototype.bluetooth = function(){
      this.search('bluetooth');
    };

    Scan.prototype.usb = function(){
      this.search('usb');
    };

    Scan.prototype.search = function(type) {
      switch (this.platform) {
        case 'linux':
          switch (type) {
            case 'serial':
              this.process.exec("dmesg | grep tty");
              break;
            case 'bluetooth':
              this.process.exec("hcitool scan");
              break;
            case 'usb':
              this.process.exec("lsusb");
              break;
            default:
              console.log("Device type not yet supported.");
              break;
          }
          break;
        case 'darwin':
          this.process.exec("ls /dev/{tty,cu}.*");
          break;
        default:
          console.log("OS not yet supported.");
      }
    };

    return Scan;
  })();
});
