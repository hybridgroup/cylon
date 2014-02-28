"use strict";

source('basestar');

var EventEmitter = require('events').EventEmitter;

describe('Basestar', function() {
  describe('constructor', function() {
    it('assigns @self to the instance of the Basestar class', function() {
      var instance = new Cylon.Basestar();
      expect(instance.self).to.be.eql(instance);
    });
  });

  describe('#proxyMethods', function() {
    var methods = ['asString', 'toString', 'returnString'];

    var ProxyClass = (function() {
      function ProxyClass() {}

      ProxyClass.prototype.asString = function() {
        return "[object ProxyClass]";
      };

      ProxyClass.prototype.toString = function() {
        return "[object ProxyClass]";
      };

      ProxyClass.prototype.returnString = function(string) {
        return string;
      };

      return ProxyClass;

    })();

    var TestClass = (function(_super) {
      subclass(TestClass, _super);

      function TestClass() {
        this.testInstance = new ProxyClass;
        this.proxyMethods(methods, this.testInstance, this, true);
      }

      return TestClass;

    })(Cylon.Basestar);

    it('can alias methods', function() {
      var testclass = new TestClass;
      expect(testclass.asString).to.be.a('function')
      expect(testclass.asString()).to.be.equal("[object ProxyClass]");
    });

    it('can alias existing methods if forced to', function() {
      var testclass = new TestClass;
      expect(testclass.toString).to.be.a('function')
      expect(testclass.toString()).to.be.equal("[object ProxyClass]");
    });

    it('can alias methods with arguments', function() {
      var testclass = new TestClass;
      expect(testclass.returnString).to.be.a('function')
      expect(testclass.returnString("testString")).to.be.equal("testString");
    });
  });

  describe("#defineEvent", function() {
    var ProxyClass = (function(klass) {
      subclass(ProxyClass, klass);
      function ProxyClass() {}
      return ProxyClass;
    })(Cylon.Basestar);

    var EmitterClass = (function(klass) {
      subclass(EmitterClass, klass);

      function EmitterClass(update) {
        update || (update = false);
        this.proxy = new ProxyClass();
        this.defineEvent({
          eventName: "testevent",
          source: this,
          target: this.proxy,
          sendUpdate: update
        });
      }

      return EmitterClass;
    })(Cylon.Basestar);

    it("proxies events from one class to another", function() {
      var eventSpy = spy(),
          testclass = new EmitterClass(),
          proxy = testclass.proxy;

      proxy.on('testevent', eventSpy);
      testclass.emit('testevent', 'data');

      assert(eventSpy.calledWith('data'))
    });

    it("emits an 'update' event if told to", function() {
      var updateSpy = spy(),
          testclass = new EmitterClass(true),
          proxy = testclass.proxy;

      proxy.on('update', updateSpy);
      testclass.emit('testevent', 'data');

      assert(updateSpy.calledWith('testevent', 'data'));
    });

    it("does not emit an 'update' event by default", function() {
      var updateSpy = spy(),
          testclass = new EmitterClass(),
          proxy = testclass.proxy;

      proxy.on('update', updateSpy);
      testclass.emit('testevent', 'data');

      assert(!updateSpy.calledWith('testevent', 'data'));
    });
  });
});
