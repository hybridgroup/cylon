'use strict';

Connection = source("connection")

describe "Connection", ->
  connection = new Connection(name: "connective", adaptor: "adaptive", robot: 'me')

  it "should belong to a robot", ->
    connection.robot.should.be.equal 'me'

  it "should have a name", ->
    connection.name.should.be.equal 'connective'

  it "should have an adaptor", ->
    connection.adaptor.should.be.equal 'adaptive'

  it "should be able to require an external adaptor module"
  it "should be able to connect"
  it "should be able to disconnect"
