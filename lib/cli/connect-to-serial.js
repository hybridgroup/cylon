(function() {
  var connectToSerial, os;

  require("./process");

  os = require('os');

  connectToSerial = function(dev, address) {
    var platform, process;
    process = new Cylon.Process;
    platform = os.platform();
    switch (platform) {
      case 'linux':
        return process.spawn('sudo', ['rfcomm', 'connect', dev, address, '1']);
      case 'darwin':
        return console.log("OS X manages binding itself.");
      default:
        return console.log("OS not yet supported");
    }
  };

  module.exports = connectToSerial;

}).call(this);
