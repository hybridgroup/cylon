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

        it("should return 1 if the number goes above the top of the scale", function() {
          expect((15).fromScale(0, 10)).to.be.eql(1);
        });

        it("should return 0 if the number goes below the bottom of the scale", function() {
          expect((5).fromScale(10, 20)).to.be.eql(0);
        });
      });

      describe("#toScale", function() {
        it("converts a value from 0-1 scale to another", function() {
          expect((0.5).toScale(0, 10)).to.be.eql(5);
        });

        it("bottom of scale should be returned when value goes below it", function() {
          expect((-5).toScale(0, 10)).to.be.eql(0);
        });

        it("top of scale should be returned when value goes above it", function() {
          expect((15).toScale(0, 10)).to.be.eql(10);
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

    it("sets a function to be called every time an interval passes", function() {
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

    it("sets a function to be called after time an interval passes", function() {
      var func = spy();
      utils.after(10, func);
      this.clock.tick(15);
      expect(func).to.be.called;
    });
  });

  describe("constantly", function() {
    beforeEach(function() {
      stub(global, 'every').returns(0);
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
        this.testInstance = new ProxyClass;
        utils.proxyFunctionsToObject(methods, this.testInstance, this, true);
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

  describe("#fetch", function() {
    var fetch = utils.fetch,
        obj = { property: 'hello world', 'false': false, 'null': null };

    context("if the property exists on the object", function() {
      it("returns the value", function() {
        expect(fetch(obj, 'property')).to.be.eql('hello world');
        expect(fetch(obj, 'false')).to.be.eql(false);
        expect(fetch(obj, 'null')).to.be.eql(null);
      });
    });

    context("if the property doesn't exist on the object", function() {
      context("and no fallback value has been provided", function() {
        it("throws an Error", function() {
          var fn = function() { return fetch(obj, "notaproperty"); };
          expect(fn).to.throw(Error, 'key not found: "notaproperty"');
        });
      });

      context("and a fallback value has been provided", function() {
        it('returns the fallback value', function() {
          expect(fetch(obj, 'notakey', 'fallback')).to.be.eql('fallback');
        });
      });

      context("and a fallback function has been provided", function() {
        context("if the function has no return value", function() {
          it("throws an Error", function() {
            var fn = function() { fetch(obj, 'notakey', function() {}); },
                str = 'no return value from provided fallback function';

            expect(fn).to.throw(Error, str);
          });
        });

        context("if the function returns a value", function() {
          it("returns the value returned by the fallback function", function() {
            var fn = function(key) { return "Couldn't find " + key },
                value = "Couldn't find notakey";

            expect(fetch(obj, 'notakey', fn)).to.be.eql(value);
          });
        });
      });
    });
  });
});
