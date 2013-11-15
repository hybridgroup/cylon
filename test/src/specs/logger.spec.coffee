'use strict';

source 'logger'

describe 'Logger', ->
  it "sets to NullLogger if false is provided", ->
    Logger.setup(false)
    Logger.toString().should.be.equal "NullLogger"

  it "sets to BasicLogger if nothing is provided", ->
    Logger.setup()
    Logger.toString().should.be.equal "BasicLogger"

  it "allows for custom loggers", ->
    logger = {toString: -> "CustomLogger"}
    Logger.setup(logger)
    Logger.toString().should.be.equal "CustomLogger"

  it 'passes all received args to loggers', ->
    logger = { debug: (message, level) -> "Debug Level #{level}: #{message}"}
    Logger.setup(logger)
    Logger.debug("demo", 4).should.be.equal "Debug Level 4: demo"

    # Now that we're done testing Logger, let's be nice and reset it for testing
    Logger.setup(false)
