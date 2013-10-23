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
  debug: (msg) -> @logger.debug msg
  info: (msg) -> @logger.info msg
  warn: (msg) -> @logger.warn msg
  error: (msg) -> @logger.error msg
  fatal: (msg) -> @logger.fatal msg

class BasicLogger
  toString: -> "BasicLogger"
  debug: (msg) -> console.log msg
  info: (msg) -> console.log msg
  warn: (msg) -> console.log msg
  error: (msg) -> console.log msg
  fatal: (msg) -> console.log msg

class NullLogger
  debug: -> #NOOP
  info: -> #NOOP
  warn: -> #NOOP
  error: -> #NOOP
  fatal: -> #NOOP
  toString: -> "NullLogger"
