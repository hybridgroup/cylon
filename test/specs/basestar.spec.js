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
});
