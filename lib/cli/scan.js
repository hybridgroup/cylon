require("./process");

var scan,
    os = require('os');

scan = function(type) {
  var process = new Cylon.Process,
      platform = os.platform();

  switch (platform) {
    case 'linux':
      switch (type) {
        case 'serial':
          process.exec("dmesg | grep tty");
          break;
        case 'bluetooth':
          process.exec("hcitool scan");
          break;
        case 'usb':
          process.exec("lsusb");
          break;
        default:
          console.log("Device type not yet supported.");
          break;
      }
      break;
    case 'darwin':
      process.exec("ls /dev/{tty,cu}.*");
      break;
    default:
      console.log("OS not yet supported.");
  }
};

module.exports = scan;
