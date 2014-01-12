(function() {
  'use strict';
  source("utils");

  describe("Utils", function() {
    describe("Monkeypatches Number", function() {
      it("adds seconds() method", function() {
        return 5..seconds().should.be.equal(5000);
      });
      it("adds second() method", function() {
        return 1..second().should.be.equal(1000);
      });
      it("scales an Integer", function() {
        return 2..fromScale(1, 10).toScale(1, 20).should.be.equal(4);
      });
      it("scales a right angle", function() {
        return 90..fromScale(1, 180).toScale(-90, 90).should.be.equal(0);
      });
      it("scales an acute angle", function() {
        return 45..fromScale(1, 180).toScale(0, 90).should.be.equal(23);
      });
      return it("scales a Float", function() {
        return 2.5.fromScale(1, 10).toScale(1, 20).should.be.equal(5);
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
