var scan = require('./scan'),
    connectToSerial = require('./connect_to_serial'),
    firmata = require('./firmata'),
    bluetooth = require('./bluetooth');

var cliCommands = {
  scan: scan,
  connectToSerial: connectToSerial,
  bluetooth: {
    pair: bluetooth.pair,
    unpair: bluetooth.unpair
  },
  firmata:{
    upload: firmata.upload
  }
}

module.exports = cliCommands;
