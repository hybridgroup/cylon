'use strict'

source 'basestar'
EventEmitter = require('events').EventEmitter

describe 'Basestar', ->
  describe 'constructor', ->
    it 'assigns @self to the instance of the Basestar class', ->
      instance = new Cylon.Basestar
      instance.self.should.be.eql instance

  describe '#proxyMethods', ->
    methods = ['asString', 'toString', 'returnString']

    class ProxyClass
      constructor: -> # noop

      asString: -> "[object ProxyClass]"
      toString: -> "[object ProxyClass]"
      returnString: (string) -> string

    class TestClass extends Cylon.Basestar
      constructor: ->
        @testInstance = new ProxyClass
        @proxyMethods methods, @testInstance, this, true

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

  # describe '#defineEvent', ->
  #   it 'proxies events', ->
  #     class EventEmittingClass extends EventEmitter
  #       constructor: ->
  #         @self = this

  #       emitEvent: ->
  #         @self.emit('transform_and_roll_out')

  #     emitter = new EventEmittingClass

  #     class EventProxyClass extends Cylon.Basestar
  #       constructor: ->
  #         @self = this
  #         @defineEvent
  #           target: @self
  #           source: emitter
  #           eventName: 'tranform_and_roll_out'

  #     proxy = new EventProxyClass

  #     emitter.emitEvent()
