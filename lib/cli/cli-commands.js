var bluetooth, cliCommands, connectToSerial, scan;

var cliCommands,
    scan = require('./scan'),
    bluetooth = require('./bluetooth'),

cliCommands = {
  scan: scan,
  bluetooth: {
    pair: bluetooth.pair,
    unpair: bluetooth.unpair,
    scan: bluetooth.scan,
    connect: bluetooth.connect
  }
};

module.exports = cliCommands;
