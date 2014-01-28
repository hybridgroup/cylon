# http://nodejs.org/api.html#_child_processes

sys = require('sys')
exec = require('child_process').exec

child

child = exec("pwd", (error, stdout, stderr) ->
  sys.print('stdout: ' + stdout)
  sys.print('stderr: \n' + stderr)


  if (error != null)
    console.log('exec error: ' + error)

)
