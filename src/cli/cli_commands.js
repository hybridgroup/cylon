var scan = require('./scan'),
    connectToSerial = require('./connect_to_serial'),
    bluetooth = require('./bluetooth');

var cliCommands = {
  scan: scan,
  connectToSerial: connectToSerial,
  pair: bluetooth.pair,
  unpair: bluetooth.unpair
}

module.exports = cliCommands;
