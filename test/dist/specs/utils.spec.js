(function() {
  'use strict';
  source("utils");

  describe("Utils", function() {
    describe("Monkeypatches Number", function() {
      it("adds seconds() method", function() {
        return 5..seconds().should.be.equal(5000);
      });
      return it("adds second() method", function() {
        return 1..second().should.be.equal(1000);
      });
    });
    return describe("#proxyFunctionsToObject", function() {
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
      TestClass = (function() {
        function TestClass() {
          this.self = this;
          this.testInstance = new ProxyClass;
          proxyFunctionsToObject(methods, this.testInstance, this.self, true);
        }

        return TestClass;

      })();
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
