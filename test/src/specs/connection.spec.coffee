'use strict';

Connection = source("connection")
Robot = source("robot")

describe "Connection", ->
  robot = new Robot(name: 'me')
  connection = new Connection(name: "connective", adaptor: "loopback", robot: robot)

  it "should belong to a robot", ->
    connection.robot.name.should.be.equal 'me'

  it "should have a name", ->
    connection.name.should.be.equal 'connective'

  it "should have an adaptor", ->
    connection.adaptor.name.should.be.equal 'Loopback'

  it "should be able to require an external adaptor module"
  it "should be able to connect"
  it "should be able to disconnect"
