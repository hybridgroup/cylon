var sys = require('sys'),
    exec = require('child_process').exec,
    os = require('os');

var commands = {

  scan: function(type) {
    switch(os.platform()){
    case 'linux':
      switch(type){
      case 'serial':
        this._stdExec('ls /dev/tty*');
        break;
      case 'bluetooth':
        this._stdExec('hcitool scan');
        break;
      case 'usb':
        this._stdExec('lsusb');
        break;
      default:
        sys.print('Device type not yet supported...\n')
      }
      break;
    case 'darwin':
      this._stdExec('ls /dev/tty*');
      break;
    default:
      sys.print('OS not yet supported...\n')
      break;
    }
  },

  _stdExec: function(command){
    exec(command, function(error, stdout, stderr){
      sys.print(stdout);
      if (stderr != '' && stderr != null){
        sys.print('Some errors were found: \n' + stderr);
      }
    });
  }
}

module.exports = commands;
