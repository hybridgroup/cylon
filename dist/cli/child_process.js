(function() {
  var exec, namespace, spawn;

  spawn = require('child_process').spawn;

  exec = require('child_process').exec;

  namespace = require('node-namespace');

  namespace("Cylon", function() {
    return this.CylonProcess = (function() {
      function CylonProcess(args) {}

      CylonProcess.prototype.exec = function(command) {
        return exec(command, function(err, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
          return console.log(err);
        });
      };

      CylonProcess.prototype.spawn = function(command, args) {
        var cmd;
        cmd = spawn(command, args, {
          stdio: 'inherit'
        });
        cmd.on('close', function(code) {
          if (code !== 0) {
            return console.log('ps process exited with code ' + code);
          }
        });
        return cmd.on('exit', function(code) {
          if (code !== 0) {
            return console.log('ps process exited with code ' + code);
          }
        });
      };

      return CylonProcess;

    })();
  });

}).call(this);
