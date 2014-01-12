'use strict';

source "utils"

describe "Utils", ->
  describe "Monkeypatches Number", ->
    it "adds seconds() method", ->
      5.seconds().should.be.equal 5000

    it "adds second() method", ->
      1.second().should.be.equal 1000

    it "scales an Integer", ->
      2.fromScale(1,10).toScale(1,20).should.be.equal 4

    it "scales a right angle", ->
      90.fromScale(1,180).toScale(-90, 90).should.be.equal 0

    it "scales an acute angle", ->
      45.fromScale(1,180).toScale(0, 90).should.be.equal 23

    it "scales a Float", ->
      (2.5).fromScale(1,10).toScale(1, 20).should.be.equal 5

  describe "#proxyFunctionsToObject", ->
    methods = ['asString', 'toString', 'returnString']

    class ProxyClass
      constructor: -> # noop

      asString: -> "[object ProxyClass]"
      toString: -> "[object ProxyClass]"
      returnString: (string) -> string

    class TestClass
      constructor: ->
        @self = this
        @testInstance = new ProxyClass
        proxyFunctionsToObject methods, @testInstance, @self, true

    it 'can alias methods', ->
      testclass = new TestClass
      assert typeof testclass.asString is 'function'
      testclass.asString().should.be.equal "[object ProxyClass]"

    it 'can alias existing methods if forced to', ->
      testclass = new TestClass
      assert typeof testclass.toString is 'function'
      testclass.toString().should.be.equal "[object ProxyClass]"

    it 'can alias methods with arguments', ->
      testclass = new TestClass
      assert typeof testclass.returnString is 'function'
      testclass.returnString("testString").should.be.equal "testString"
