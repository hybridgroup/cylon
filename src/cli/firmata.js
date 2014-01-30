var ChildProcess = require('./child_process'),
    sys = require('sys'),
    os = require('os');

var firmata = {
  upload: function(serialPort, hexFile) {
    part = '-patmega328p';
    programmer = '-carduino';
    baudrate = '-b115200';
    hexFile = (hexFile === null || hexFile === undefined) ? '-Uflash:w:' + __dirname + '/hex/StandardFirmata.cpp.hex:i' : hexFile;
    switch(os.platform()){
    case 'linux':
      port = '-P/dev/' + serialPort;
      ChildProcess.spawn('avrdude', [part, programmer, port, baudrate, '-D', hexFile]);
      break;
    case 'darwin':
      port = '-P' + serialPort;
      ChildProcess.spawn('avrdude', [part, programmer, port, baudrate, '-D', hexFile]);
      sys.print('OSX upload firmata command in the works...\n')
      break;
    default:
      sys.print('OS not yet supported...\n')
      break;
    }
  }
}

module.exports = firmata;
