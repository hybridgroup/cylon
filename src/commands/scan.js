var sys = require('sys'),
    exec = require('child_process').exec,
    os = require('os');

var _stdExec = function(command){
  exec(command, function(error, stdout, stderr){
    sys.print(stdout);
    if (stderr != '' && stderr != null){
      sys.print('Some errors were found: \n' + stderr);
    }
  });
}

var scan = function(type) {
    switch(os.platform()){
    case 'linux':
      switch(type){
      case 'serial':
        _stdExec('ls /dev/tty*');
        break;
      case 'bluetooth':
        _stdExec('hcitool scan');
        break;
      case 'usb':
        _stdExec('lsusb');
        break;
      default:
        sys.print('Device type not yet supported...\n')
      }
      break;
    case 'darwin':
      _stdExec('ls /dev/tty*');
      break;
    default:
      sys.print('OS not yet supported...\n')
      break;
    }
  }

module.exports = scan;
