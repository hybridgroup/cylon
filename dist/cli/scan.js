(function() {
  var os, scan;

  require("./process");

  os = require('os');

  scan = function(type) {
    var platform, process;
    process = new Cylon.Process;
    platform = os.platform();
    switch (platform) {
      case 'linux':
        switch (type) {
          case 'serial':
            return process.exec("dmesg | grep tty");
          case 'bluetooth':
            return process.exec("hcitool scan");
          case 'usb':
            return process.exec("lsusb");
          default:
            return console.log("Device type not yet supported.");
        }
        break;
      case 'darwin':
        return process.exec("ls /dev/{tty,cu}.*");
      default:
        return console.log("OS not yet supported.");
    }
  };

  module.exports = scan;

}).call(this);
