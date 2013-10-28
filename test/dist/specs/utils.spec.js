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
      var base;
      base = {};
      it('can alias methods', function() {
        var proxyObject;
        proxyObject = {
          asString: function() {
            return "[object ProxyObject]";
          }
        };
        proxyFunctionsToObject(['asString'], proxyObject, base);
        assert(typeof base.asString === 'function');
        return base.asString().should.be.equal("[object ProxyObject]");
      });
      it('can alias existing methods if forced to', function() {
        var proxyObject;
        proxyObject = {
          toString: function() {
            return "[object ProxyObject]";
          }
        };
        proxyFunctionsToObject(['toString'], proxyObject, base, true);
        assert(typeof base.toString === 'function');
        return base.toString().should.be.equal("[object ProxyObject]");
      });
      return it('can alias methods with arguments', function() {
        var proxyObject;
        proxyObject = {
          returnString: function(string) {
            return string;
          }
        };
        proxyFunctionsToObject(['returnString'], proxyObject, base);
        assert(typeof base.returnString === 'function');
        return base.returnString("testString").should.be.equal("testString");
      });
    });
  });

}).call(this);
