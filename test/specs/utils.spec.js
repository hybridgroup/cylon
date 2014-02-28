'use strict';
source("utils");

describe("Utils", function() {
  describe("Monkeypatches Number", function() {
    it("adds seconds() method", function() {
      5..seconds().should.be.equal(5000);
    });

    it("adds second() method", function() {
      1..second().should.be.equal(1000);
    });

    it("scales an Integer", function() {
      2..fromScale(1, 10).toScale(1, 20).should.be.equal(4);
    });

    it("scales a right angle", function() {
      90..fromScale(1, 180).toScale(-90, 90).should.be.equal(0);
    });

    it("scales an acute angle", function() {
      45..fromScale(1, 180).toScale(0, 90).should.be.equal(23);
    });

    it("scales a Float", function() {
      2.5.fromScale(1, 10).toScale(1, 20).should.be.equal(5);
    });
  });

  describe("#proxyFunctionsToObject", function() {
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
      testclass.asString().should.be.equal("[object ProxyClass]");
    });

    it('can alias existing methods if forced to', function() {
      var testclass;
      testclass = new TestClass;
      assert(typeof testclass.toString === 'function');
      testclass.toString().should.be.equal("[object ProxyClass]");
    });

    it('can alias methods with arguments', function() {
      var testclass;
      testclass = new TestClass;
      assert(typeof testclass.returnString === 'function');
      testclass.returnString("testString").should.be.equal("testString");
    });
  });

  describe("#proxyTestStubs", function() {
    it("proxies methods to an object's commandList", function() {
      var base, methods;
      methods = ["hello", "goodbye"];
      base = {
        commandList: []
      };
      proxyTestStubs(methods, base);
      expect(base.commandList).to.be.eql(methods);
    });

    it("returns the object methods have been proxied to", function() {
      var base, methods;
      methods = ["hello", "goodbye"];
      base = {
        commandList: []
      };
      expect(proxyTestStubs(methods, base)).to.be.eql(base);
    });
  });

  describe("#bind", function() {
    var me = { hello: "Hello World" };
    var proxy = {
      boundMethod: function() { return this.hello; }
    };

    it("binds the 'this' scope for the method", function() {
      proxy.boundMethod = function() { return this.hello; };
      proxy.boundMethod = bind(proxy.boundMethod, me);

      expect(proxy.boundMethod()).to.eql("Hello World");
    });

    it("passes arguments along to bound functions", function() {
      proxy.boundMethod = function(hello, world) { return [hello, world]; };
      proxy.boundMethod = bind(proxy.boundMethod, me);

      expect(proxy.boundMethod("Hello", "World")).to.eql(["Hello", "World"]);
    })
  });
});
