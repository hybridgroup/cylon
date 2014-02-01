(function() {
  var os, scan;

  require("./process");

  os = require('os');

  scan = function(type) {
    var cylonProcess;
    cylonProcess = new Cylon.Process;
    switch (os.platform()) {
      case 'linux':
        switch (type) {
          case 'serial':
            return cylonProcess.exec('dmesg | grep tty');
          case 'bluetooth':
            return cylonProcess.exec('hcitool scan');
          case 'usb':
            return cylonProcess.exec('lsusb');
          default:
            return console.log('Device type not yet supported...\n');
        }
        break;
      case 'darwin':
        return cylonProcess.exec('ls /dev/tty.*');
      default:
        return console.log('OS not yet supported...\n');
    }
  };

  module.exports = scan;

}).call(this);
