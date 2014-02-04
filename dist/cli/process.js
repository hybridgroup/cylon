(function() {
  var exec, namespace, spawn;

  spawn = require('child_process').spawn;

  exec = require('child_process').exec;

  namespace = require('node-namespace');

  namespace("Cylon", function() {
    return this.Process = (function() {
      function Process(args) {
        true;
      }

      Process.prototype.exec = function(command) {
        exec(command, function(err, stdout, stderr) {
          if (stdout != null) {
            console.log(stdout);
          }
          if (stderr != null) {
            console.log(stderr);
          }
          if (err != null) {
            return console.log(err);
          }
        });
        return true;
      };

      Process.prototype.spawn = function(command, args) {
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

      return Process;

    })();
  });

}).call(this);
