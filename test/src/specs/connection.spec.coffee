'use strict';

Connection = source("connection")
Adaptor = source("adaptor")
Robot = source("robot")

describe "Connection", ->
  robot = new Robot(name: 'me')
  adaptor = new Adaptor(name: 'loopback')
  requireAdaptor = sinon.stub(robot, 'requireAdaptor').returns(adaptor)
  connection = new Connection(name: "connective", adaptor: "loopback", robot: robot)

  it "should belong to a robot", ->
    connection.robot.name.should.be.equal 'me'

  it "should have a name", ->
    connection.name.should.be.equal 'connective'

  it "should have an adaptor", ->
    connection.adaptor.name.should.be.equal 'loopback'

  it "should be able to require an external adaptor module"
  it "should be able to connect"
  it "should be able to disconnect"

  it 'can alias methods with addProxy()', ->
    proxyObject = { toString: -> "[object ProxyObject]" }
    connection.addProxy(proxyObject, 'toString')
    assert typeof connection.toString is 'function'
    connection.toString().should.be.equal "[object ProxyObject]"

  it 'can alias methods with arguments with addProxy()', ->
    proxyObject = { returnString: (string) -> string }
    connection.addProxy(proxyObject, 'returnString')
    assert typeof connection.returnString is 'function'
    connection.returnString("testString").should.be.equal "testString"
