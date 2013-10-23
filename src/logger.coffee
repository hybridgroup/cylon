###
 * logger
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

global.Logger =
  setup: (logger = new BasicLogger) ->
    @logger = if logger is false then new NullLogger else logger

  toString: -> @logger.toString()
  debug: (args...) -> @logger.debug args...
  info: (args...) -> @logger.info args...
  warn: (args...) -> @logger.warn args...
  error: (args...) -> @logger.error args...
  fatal: (args...) -> @logger.fatal args...

class BasicLogger
  toString: -> "BasicLogger"
  debug: (args...) -> console.log args...
  info: (args...) -> console.log args...
  warn: (args...) -> console.log args...
  error: (args...) -> console.log args...
  fatal: (args...) -> console.log args...

class NullLogger
  debug: -> #NOOP
  info: -> #NOOP
  warn: -> #NOOP
  error: -> #NOOP
  fatal: -> #NOOP
  toString: -> "NullLogger"
