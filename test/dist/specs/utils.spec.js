(function() {
  'use strict';
  var utils;

  utils = source("utils");

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
      var TestClass, proxyObject;
      proxyObject = {
        asString: function() {
          return "[object ProxyObject]";
        },
        toString: function() {
          return "[object ProxyObject]";
        },
        returnString: function(string) {
          return string;
        }
      };
      TestClass = (function() {
        function TestClass() {
          var methods;
          this.myself = this;
          methods = ['asString', 'toString', 'returnString'];
          proxyFunctionsToObject(methods, proxyObject, this.myself, true);
        }

        return TestClass;

      })();
      it('can alias methods', function() {
        var testclass;
        testclass = new TestClass;
        assert(typeof testclass.asString === 'function');
        return testclass.asString().should.be.equal("[object ProxyObject]");
      });
      it('can alias existing methods if forced to', function() {
        var testclass;
        testclass = new TestClass;
        assert(typeof testclass.toString === 'function');
        return testclass.toString().should.be.equal("[object ProxyObject]");
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
