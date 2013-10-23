'use strict';

Adaptor = source("adaptor")

describe "Adaptor", ->
  adaptor = new Adaptor(name: "adaptive")

  it "should have a name", ->
    adaptor.should.have.keys 'name'
    adaptor.name.should.be.equal 'adaptive'

  it "should be able to connect"
  it "should be able to disconnect"

  it 'can alias methods with addProxy()', ->
    proxyObject = { toString: -> "[object ProxyObject]" }
    adaptor.addProxy(proxyObject, 'toString')
    assert typeof adaptor.toString is 'function'
    adaptor.toString().should.be.equal "[object ProxyObject]"

  it 'can alias methods with arguments with addProxy()', ->
    proxyObject = { returnString: (string) -> string }
    adaptor.addProxy(proxyObject, 'returnString')
    assert typeof adaptor.returnString is 'function'
    adaptor.returnString("testString").should.be.equal "testString"
