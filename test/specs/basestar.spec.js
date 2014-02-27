(function() {
  'use strict';
  var EventEmitter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  source('basestar');

  EventEmitter = require('events').EventEmitter;

  describe('Basestar', function() {
    describe('constructor', function() {
      return it('assigns @self to the instance of the Basestar class', function() {
        var instance;
        instance = new Cylon.Basestar;
        return instance.self.should.be.eql(instance);
      });
    });
    return describe('#proxyMethods', function() {
      var ProxyClass, TestClass, methods;
      methods = ['asString', 'toString', 'returnString'];
      ProxyClass = (function() {
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
      TestClass = (function(_super) {
        __extends(TestClass, _super);

        function TestClass() {
          this.testInstance = new ProxyClass;
          this.proxyMethods(methods, this.testInstance, this, true);
        }

        return TestClass;

      })(Cylon.Basestar);
      it('can alias methods', function() {
        var testclass;
        testclass = new TestClass;
        assert(typeof testclass.asString === 'function');
        return testclass.asString().should.be.equal("[object ProxyClass]");
      });
      it('can alias existing methods if forced to', function() {
        var testclass;
        testclass = new TestClass;
        assert(typeof testclass.toString === 'function');
        return testclass.toString().should.be.equal("[object ProxyClass]");
      });
      return it('can alias methods with arguments', function() {
        var testclass;
        testclass = new TestClass;
        assert(typeof testclass.returnString === 'function');
        return testclass.returnString("testString").should.be.equal("testString");
      });
    });
  });

}).call(this);
