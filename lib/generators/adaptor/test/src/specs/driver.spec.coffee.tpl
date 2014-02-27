'use strict'

driver = source("driver")

describe "Cylon.Drivers.<%= adaptorClassName %>", ->
  module = new Cylon.Drivers.<%= adaptorClassName %>
    device: { connection: 'connect' }

  it "needs tests"
