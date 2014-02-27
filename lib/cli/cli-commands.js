(function() {
  var bluetooth, cliCommands, connectToSerial, scan;

  scan = require('./scan');

  connectToSerial = require('./connect-to-serial');

  bluetooth = require('./bluetooth');

  cliCommands = {
    scan: scan,
    connectToSerial: connectToSerial,
    bluetooth: {
      pair: bluetooth.pair,
      unpair: bluetooth.unpair,
      scan: bluetooth.scan
    }
  };

  module.exports = cliCommands;

}).call(this);
