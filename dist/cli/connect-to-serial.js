(function() {
  var connectToSerial, os;

  require("./process");

  os = require('os');

  connectToSerial = function(dev, address) {
    var cylonProcess;
    cylonProcess = new Cylon.Process;
    switch (os.platform()) {
      case 'linux':
        return cylonProcess.spawn('sudo', ['rfcomm', 'connect', dev, address, '1']);
      case 'darwin':
        return console.log('OSX binds devices on its own volition...\n');
      default:
        return console.log('OS not yet supported...\n');
    }
  };

  module.exports = connectToSerial;

}).call(this);
