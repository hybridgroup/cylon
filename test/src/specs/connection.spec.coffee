'use strict';

source "connection"
source "adaptor"
source "robot"
source "test/loopback"

describe "Connection", ->
  robot = new Cylon.Robot(name: 'me')
  adaptor = new Cylon.Adaptors.Loopback(name: 'loopy')
  initAdaptor = sinon.stub(robot, 'initAdaptor').returns(adaptor)
  connection = new Cylon.Connection
    name: "connective"
    adaptor: "loopback"
    robot: robot

  it "belongs to a robot", ->
    connection.robot.name.should.be.equal 'me'

  it "has a name", ->
    connection.name.should.be.equal 'connective'

  it "has an adaptor", ->
    connection.adaptor.name.should.be.equal 'loopy'

  it "can init an external adaptor module", ->
    initAdaptor.should.be.called

  it "can connect to adaptor", ->
    adaptorConnect = sinon.stub(adaptor, 'connect').returns(true)
    connection.connect()
    adaptorConnect.should.be.called

  it "can disconnect from adaptor", ->
    adaptorDisconnect = sinon.stub(adaptor, 'disconnect').returns(true)
    connection.disconnect()
    adaptorDisconnect.should.be.called
