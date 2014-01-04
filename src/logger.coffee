###
 * logger
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

# The Logger is a global object to facilitate logging stuff to the console (or
# other output) easily and consistently. It's available anywhere in Cylon, as
# well as in external modules that are loaded into Cylon
global.Logger =

  # Public: Creates a Logger instance and assigns it to @logger
  #
  # logger - logger object to use. Defaults to a BasicLogger, or a NullLogger if
  # false is supplied
  #
  # Returns the new logger instance
  setup: (logger = new BasicLogger) ->
    @logger = if logger is false then new NullLogger else logger

  toString: -> @logger.toString()

  debug: (args...) -> @logger.debug args...
  info: (args...) -> @logger.info args...
  warn: (args...) -> @logger.warn args...
  error: (args...) -> @logger.error args...
  fatal: (args...) -> @logger.fatal args...

# The BasicLogger pushes stuff to console.log. Nothing more, nothing less.
class BasicLogger
  toString: -> "BasicLogger"

  debug: (args...) ->
    console.log "D, [#{new Date().toISOString()}] DEBUG -- :", args...

  info: (args...) ->
    console.log "I, [#{new Date().toISOString()}]  INFO -- :", args...

  warn: (args...) ->
    console.log "W, [#{new Date().toISOString()}]  WARN -- :", args...

  error: (args...) ->
    console.log "E, [#{new Date().toISOString()}] ERROR -- :", args...

  fatal: (args...) ->
    console.log "F, [#{new Date().toISOString()}] FATAL -- :", args...

# The NullLogger is designed for cases where you want absolutely nothing to
# print to anywhere. Every proxied method from the Logger returns a noop.
class NullLogger
  toString: -> "NullLogger"

  debug: -> #NOOP
  info: -> #NOOP
  warn: -> #NOOP
  error: -> #NOOP
  fatal: -> #NOOP
