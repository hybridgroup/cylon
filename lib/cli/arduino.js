var os = require('os'),
    namespace = require('node-namespace');

namespace("Cylon.CLI", function() {
  this.Arduino = (function() {
    function Arduino() {}

    Arduino.prototype.upload = function(serialPort, hexFile) {
      var cylonProcess = new Cylon.Process(),
          part = '-patmega328p',
          programmer = '-carduino',
          baudrate = '-b115200',
          hexFile = "-Uflash:w:" + hexFile + ":i",
          port = serialPort.search(/[\/\:]/) >= 0 ? "-P" + serialPort : "-P/dev/" + serialPort;

      switch (os.platform()) {
        case 'linux':
          cylonProcess.spawn('avrdude', [part, programmer, port, baudrate, '-D', hexFile]);
          break;
        case 'darwin':
          cylonProcess.spawn('avrdude', [part, programmer, port, baudrate, '-D', hexFile]);
          break;
        default:
          console.log('OS not yet supported...\n');
      }
      return true;
    };

    Arduino.prototype.install = function() {
      var cylonProcess = new Cylon.Process();

      switch (os.platform()) {
        case 'linux':
          console.log("Should be installing...");
          cylonProcess.spawn('sudo', ['apt-get', 'install', 'avrdude']);
          break;
        case 'darwin':
          cylonProcess.exec('brew install avrdude');
          break;
        default:
          console.log('OS not yet supported...\n');
      }
      return true;
    };

    return Arduino;

  })();
});
