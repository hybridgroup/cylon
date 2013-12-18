'use strict';

source "driver"
EventEmitter = require('events').EventEmitter

describe "Driver", ->
  device = new EventEmitter
  device.connection = 'connect'
  driver = new Cylon.Driver
    name: 'TestDriver'
    device: device

  it "provides a 'start' method that accepts a callback", ->
    expect(driver.start).to.be.a 'function'
    spy = sinon.spy()
    driver.start(-> spy())
    spy.should.have.been.called

  it "tells the device to emit the 'start' event when started", ->
    spy = sinon.spy()
    driver.device.on 'start', -> spy()
    driver.start(->)
    spy.should.have.been.called

  it "provides a 'stop' method", ->
    expect(driver.stop).to.be.a 'function'

  it "provides a default empty array of commands", ->
    expect(driver.commands()).to.be.eql []

  it "saves the provided name in the @name variable", ->
    expect(driver.name).to.be.eql "TestDriver"

  it "saves the provided device in the @device variable", ->
    expect(driver.device).to.be.eql device

  it "saves the provided device connection in the @device variable", ->
    expect(driver.connection).to.be.eql 'connect'

  it "contains a reference to itself in the @self variable", ->
    expect(driver.self).to.be.eql driver
