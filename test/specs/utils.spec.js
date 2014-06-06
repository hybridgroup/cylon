"use strict";

var utils = source("utils");

describe("Utils", function() {
  describe("Monkey-patches", function() {
    describe("Number", function() {
      describe("#seconds", function() {
        it("allows for expressing time in seconds", function() {
          expect((5).seconds()).to.be.eql(5000);
        });
      });

      describe("#second", function() {
        it("allows for expressing time in seconds", function() {
          expect((1).second()).to.be.eql(1000);
        });
      });

      describe("#fromScale", function() {
        it("converts a value from one scale to 0-1 scale", function() {
          expect((5).fromScale(0, 10)).to.be.eql(0.5);
        });

        it("converts floats", function() {
          expect(2.5.fromScale(0, 10)).to.be.eql(0.25);
        });
      });

      describe("#toScale", function() {
        it("converts a value from 0-1 scale to another", function() {
          expect((0.5).toScale(0, 10)).to.be.eql(5);
        });

        it("converts to floats", function() {
          expect(0.25.toScale(0, 10)).to.be.eql(2.5);
        });

        it("can be chained with #fromScale", function() {
          var num = (5).fromScale(0, 20).toScale(0, 10);
          expect(num).to.be.eql(2.5);
        });
      });
    });
  });

  describe("#every", function() {
    before(function() {
      this.clock = sinon.useFakeTimers();
    });

    after(function() {
      this.clock.restore();
    });

    it("sets a function to be called every time an interval passes", function() {
      var func = spy();
      utils.every(10, func);
      this.clock.tick(25);
      expect(func).to.be.calledTwice;
    });
  });

  describe("#after", function() {
    before(function() {
      this.clock = sinon.useFakeTimers();
    });

    after(function() {
      this.clock.restore();
    });

    it("sets a function to be called after time an interval passes", function() {
      var func = spy();
      utils.after(10, func);
      this.clock.tick(15);
      expect(func).to.be.called;
    });
  });

  describe("constantly", function() {
    before(function() {
      stub(global, 'every').returns(0);
    });

    after(function() {
      global.every.restore();
    });

    it("schedules a task to run continuously with #every", function() {
      var func = function() {};
      utils.constantly(func);

      expect(global.every).to.be.calledWith(0, func);
    });
  });

  describe("#subclass", function() {
    var BaseClass = (function() {
      function BaseClass(opts) {
        this.greeting = opts.greeting;
      };

      BaseClass.prototype.sayHi = function() {
        return "Hi!";
      };

      return BaseClass
    })();

    var SubClass = (function(klass) {
      utils.subclass(SubClass, klass);

      function SubClass(opts) {
        SubClass.__super__.constructor.apply(this, arguments);
      };

      return SubClass;
    })(BaseClass);

    it("adds inheritance to Javascript classes", function() {
      var sub = new SubClass({greeting: "Hello World"});
      expect(sub.greeting).to.be.eql("Hello World");
      expect(sub.sayHi()).to.be.eql("Hi!");
    });
  });

  describe("#proxyFunctionsToObject", function() {
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

    var TestClass = (function() {
      function TestClass() {
        this.self = this;
        this.testInstance = new ProxyClass;
        utils.proxyFunctionsToObject(methods, this.testInstance, this.self, true);
      }

      return TestClass;
    })();

    var testclass = new TestClass();

    it('can alias methods', function() {
      expect(testclass.asString()).to.be.eql("[object ProxyClass]");
    });

    it('can alias existing methods if forced to', function() {
      expect(testclass.toString()).to.be.eql("[object ProxyClass]");
    });

    it('can alias methods with arguments', function() {
      expect(testclass.returnString).to.be.a('function');
    });
  });

  describe("#proxyTestStubs", function() {
    it("proxies methods to an object's commandList", function() {
      var methods = ["hello", "goodbye"],
          base = { commandList: [] };

      utils.proxyTestStubs(methods, base);
      expect(base.commandList).to.be.eql(methods);
    });

    it("returns the object methods have been proxied to", function() {
      var methods = ["hello", "goodbye"],
          base = { commandList: [] };

      expect(utils.proxyTestStubs(methods, base)).to.be.eql(base);
    });
  });

  describe("#bind", function() {
    var me = { hello: "Hello World" },
        proxy = { boundMethod: function() { return this.hello; } };

    it("binds the 'this' scope for the method", function() {
      proxy.boundMethod = function() { return this.hello; };
      proxy.boundMethod = utils.bind(proxy.boundMethod, me);

      expect(proxy.boundMethod()).to.eql("Hello World");
    });

    it("passes arguments along to bound functions", function() {
      proxy.boundMethod = function(hello, world) { return [hello, world]; };
      proxy.boundMethod = utils.bind(proxy.boundMethod, me);

      expect(proxy.boundMethod("Hello", "World")).to.eql(["Hello", "World"]);
    })
  });
});
