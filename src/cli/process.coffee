spawn = require('child_process').spawn
exec = require('child_process').exec
namespace = require 'node-namespace'

namespace "Cylon", ->
  class @Process

    constructor: (args) ->
      true

    exec: (command) ->
      exec(command, (err, stdout, stderr) ->
        console.log(stdout) if stdout?
        console.log(stderr) if stderr?
        console.log(err) if err?
      )

      true

    spawn: (command, args) ->

      cmd = spawn(command, args, { stdio: 'inherit' })

      cmd.on('close', (code) ->
        if (code != 0)
          console.log('ps process exited with code ' + code)
      )

      cmd.on('exit', (code) ->
        if (code != 0)
          console.log('ps process exited with code ' + code)
      )
