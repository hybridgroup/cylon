var sys = require('sys'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec;

var childProcess = {
  exec: function(command){
    exec(command, function(err, stdout, stderr){
      sys.print(stdout);
      sys.print(stderr);
      sys.print(err);
    });
  },

  spawn: function(command, args){

    cmd = spawn(command, args, { stdio: 'inherit' });

    cmd.on('close', function (code) {
      if (code !== 0) {
        console.log('ps process exited with code ' + code);
      }
    });

    cmd.on('exit', function (code) {
      if (code !== 0) {
        console.log('ps process exited with code ' + code);
      }
    });
  }
}

module.exports = childProcess;
