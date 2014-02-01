scan = require('./scan')
connectToSerial = require('./connect-to-serial')
bluetooth = require('./bluetooth')

cliCommands =
  scan: scan
  connectToSerial: connectToSerial
  bluetooth:
    pair: bluetooth.pair
    unpair: bluetooth.unpair

module.exports = cliCommands
