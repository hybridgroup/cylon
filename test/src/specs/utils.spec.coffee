'use strict';

utils = source("utils")

describe "Utils", ->
  describe "Monkeypatches Number", ->
    it "adds seconds() method", ->
      5.seconds().should.be.equal 5000

    it "adds second() method", ->
      1.second().should.be.equal 1000

  describe "#proxyFunctionsToObject", ->
    base = {}

    it 'can alias methods', ->
      proxyObject = { asString: -> "[object ProxyObject]" }
      proxyFunctionsToObject(['asString'], proxyObject, base)
      assert typeof base.asString is 'function'
      base.asString().should.be.equal "[object ProxyObject]"

    it 'can alias existing methods if forced to', ->
      proxyObject = { toString: -> "[object ProxyObject]" }
      proxyFunctionsToObject(['toString'], proxyObject, base, true)
      assert typeof base.toString is 'function'
      base.toString().should.be.equal "[object ProxyObject]"

    it 'can alias methods with arguments', ->
      proxyObject = { returnString: (string) -> string }
      proxyFunctionsToObject(['returnString'], proxyObject, base)
      assert typeof base.returnString is 'function'
      base.returnString("testString").should.be.equal "testString"
