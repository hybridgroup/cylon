spawn = require('child_process').spawn
exec = require('child_process').exec
namespace = require 'node-namespace'

namespace "Cylon", ->
  class @Process
    exec: (command) ->
      exec command, (err, stdout, stderr) ->
        console.log(stdout) if stdout?
        console.log(stderr) if stderr?
        console.log(err) if err?

      true

    spawn: (command, args) ->
      cmd = spawn command, args, { stdio: 'inherit' }

      cmd.on 'close', (code) ->
        console.log "ps process exited with code #{code}" if code isnt 0

      cmd.on 'exit', (code) ->
        console.log "ps process exited with code #{code}" if code isnt 0

module.exports = Cylon.Process
