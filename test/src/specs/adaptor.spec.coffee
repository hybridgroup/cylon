'use strict'

source "adaptor"
EventEmitter = require('events').EventEmitter

describe "Adaptor", ->
  conn = new EventEmitter
  adaptor = new Cylon.Adaptor
    name: 'TestAdaptor'
    connection: conn

  it "provides a 'connect' method that accepts a callback", ->
    expect(adaptor.connect).to.be.a 'function'
    spy = sinon.spy()
    adaptor.connect(-> spy())
    spy.should.have.been.called

  it "tells the connection to emit the 'connect' event when connected", ->
    spy = sinon.spy()
    adaptor.connection.on 'connect', -> spy()
    adaptor.connect(->)
    spy.should.have.been.called

  it "provides a 'disconnect' method", ->
    expect(adaptor.disconnect).to.be.a 'function'

  it "provides a default empty array of commands", ->
    expect(adaptor.commands()).to.be.eql []

  it "saves the provided name in the @name variable", ->
    expect(adaptor.name).to.be.eql "TestAdaptor"

  it "saves the provided connection in the @connection variable", ->
    expect(adaptor.connection).to.be.eql conn

  it "contains a reference to itself in the @self variable", ->
    expect(adaptor.self).to.be.eql adaptor
