"use strict";

var utils = lib("utils");

describe("Utils", function() {
  describe("#makeUnique", function() {
    it("returns the original name if it's not a conflict", function() {
      var res = utils.makeUnique("hello", ["world"]);
      expect(res).to.be.eql("hello");
    });

    it("generates a unique name if it does collide", function() {
      var res = utils.makeUnique("hello", ["hello"]);
      expect(res).to.be.eql("hello-1");
    });

    it("will ignore existing duplicates", function() {
      var res = utils.makeUnique("hello", ["hello", "hello-1", "hello-2"]);
      expect(res).to.be.eql("hello-3");
    });
  });

  describe("#every", function() {
    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      this.clock.restore();
    });

    it("sets a function to be called when an interval passes", function() {
      var func = spy();
      utils.every(10, func);
      this.clock.tick(25);
      expect(func).to.be.calledTwice;
    });
  });

  describe("#after", function() {
    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      this.clock.restore();
    });

    it("sets a function to be called after an interval passes", function() {
      var func = spy();
      utils.after(10, func);
      this.clock.tick(15);
      expect(func).to.be.called;
    });
  });

  describe("constantly", function() {
    beforeEach(function() {
      stub(global, "every").returns(0);
    });

    afterEach(function() {
      global.every.restore();
    });

    it("schedules a task to run continuously with #every", function() {
      var func = function() {};
      utils.constantly(func);

      expect(global.every).to.be.calledWith(0, func);
    });
  });

  describe("#finish", function() {
    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      this.clock.restore();
    });

    it("stops calling an interval function", function() {
      var func = spy();
      var interval = utils.every(10, func);
      this.clock.tick(15);
      utils.finish(interval);
      this.clock.tick(15);
      expect(func).to.be.calledOnce;
    });
  });

  describe("#subclass", function() {
    var BaseClass = function BaseClass(opts) {
      this.greeting = opts.greeting;
    };

    BaseClass.prototype.sayHi = function() {
      return "Hi!";
    };

    var SubClass = function SubClass() {
      SubClass.__super__.constructor.apply(this, arguments);
    };

    utils.subclass(SubClass, BaseClass);

    it("adds inheritance to Javascript classes", function() {
      var sub = new SubClass({greeting: "Hello World"});
      expect(sub.greeting).to.be.eql("Hello World");
      expect(sub.sayHi()).to.be.eql("Hi!");
    });
  });

  describe("#proxyFunctionsToObject", function() {
    var methods = ["asString", "toString", "returnString"];

    var ProxyClass = function ProxyClass() {};

    ProxyClass.prototype.asString = function() {
      return "[object ProxyClass]";
    };

    ProxyClass.prototype.toString = function() {
      return "[object ProxyClass]";
    };

    ProxyClass.prototype.returnString = function(string) {
      return string;
    };

    var TestClass = function TestClass() {
      this.testInstance = new ProxyClass();
      utils.proxyFunctionsToObject(methods, this.testInstance, this, true);
    };

    var testclass = new TestClass();

    it("can alias methods", function() {
      expect(testclass.asString()).to.be.eql("[object ProxyClass]");
    });

    it("can alias existing methods if forced to", function() {
      expect(testclass.toString()).to.be.eql("[object ProxyClass]");
    });

    it("can alias methods with arguments", function() {
      expect(testclass.returnString).to.be.a("function");
    });
  });

  describe("#fetch", function() {
    var fetch = utils.fetch,
        obj = { property: "hello world", false: false, null: null };

    context("if the property exists on the object", function() {
      it("returns the value", function() {
        expect(fetch(obj, "property")).to.be.eql("hello world");
        expect(fetch(obj, "false")).to.be.eql(false);
        expect(fetch(obj, "null")).to.be.eql(null);
      });
    });

    context("if the property doesn't exist on the object", function() {
      context("and no fallback value has been provided", function() {
        it("throws an Error", function() {
          var fn = function() { return fetch(obj, "notaproperty"); };
          expect(fn).to.throw(Error, "key not found: \"notaproperty\"");
        });
      });

      context("and a fallback value has been provided", function() {
        it("returns the fallback value", function() {
          expect(fetch(obj, "notakey", "fallback")).to.be.eql("fallback");
        });
      });

      context("and a fallback function has been provided", function() {
        context("if the function has no return value", function() {
          it("throws an Error", function() {
            var fn = function() { fetch(obj, "notakey", function() {}); },
                str = "no return value from provided fallback function";

            expect(fn).to.throw(Error, str);
          });
        });

        context("if the function returns a value", function() {
          it("returns the value returned by the fallback function", function() {
            var fn = function(key) { return "Couldn't find " + key; },
                value = "Couldn't find notakey";

            expect(fetch(obj, "notakey", fn)).to.be.eql(value);
          });
        });
      });
    });
  });

  describe("#classCallCheck", function() {
    it("checks that an object is an instance of a constructor", function() {
      var fn = function(instance, Constructor) {
        return utils.classCallCheck.bind(null, instance, Constructor);
      };

      function Class() {
        utils.classCallCheck(this, Class);
      }

      expect(fn([], Array)).to.not.throw;
      expect(fn([], Number)).to.throw(TypeError);

      expect(Class).to.throw(TypeError);
      expect(function() { return new Class(); }).not.to.throw(TypeError);
    });
  });
});
