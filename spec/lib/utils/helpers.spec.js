"use strict";

var _ = lib("utils/helpers");

describe("Helpers", function() {
  describe("extend", function() {
    var extend = _.extend;

    var base = {
      fruits: ["apple"],
      vegetables: ["beet"],
      thing: null,
      otherThing: "hello!",
      data: [{ user: "barney" }, { user: "fred" }]
    };

    var source = {
      fruits: ["banana"],
      vegetables: ["carrot"],
      thing: "hello!",
      otherThing: null,
      data: [{ age: 36 }, { age: 40 }]
    };

    var expected = {
      data: [ { age: 36, user: "barney" }, { age: 40, user: "fred" } ],
      fruits: [ "apple", "banana" ],
      vegetables: [ "beet", "carrot" ],
      thing: "hello!",
      otherThing: null
    };

    it("extends two objects", function() {
      var extended = extend(base, source);
      expect(extended).to.be.eql(expected);
    });
  });

  describe("isObject", function() {
    var fn = _.isObject;

    it("checks if a value is an Object", function() {
      var Klass = function() {},
          instance = new Klass();

      expect(fn({})).to.be.eql(true);
      expect(fn(instance)).to.be.eql(true);

      expect(fn([])).to.be.eql(false);
      expect(fn(function() {})).to.be.eql(false);
      expect(fn(10)).to.be.eql(false);
      expect(fn("")).to.be.eql(false);
    });
  });

  describe("isFunction", function() {
    var fn = _.isFunction;

    it("checks if a value is a Function", function() {
      expect(fn(function() {})).to.be.eql(true);

      expect(fn({})).to.be.eql(false);
      expect(fn([])).to.be.eql(false);
      expect(fn(10)).to.be.eql(false);
      expect(fn("")).to.be.eql(false);
    });
  });

  describe("isArray", function() {
    var fn = _.isArray;

    it("checks if a value is an Array", function() {
      expect(fn([])).to.be.eql(true);

      expect(fn(function() {})).to.be.eql(false);
      expect(fn({})).to.be.eql(false);
      expect(fn(10)).to.be.eql(false);
      expect(fn("")).to.be.eql(false);
    });
  });

  describe("isNumber", function() {
    var fn = _.isNumber;

    it("checks if a value is a Number", function() {
      expect(fn(10)).to.be.eql(true);

      expect(fn(function() {})).to.be.eql(false);
      expect(fn({})).to.be.eql(false);
      expect(fn([])).to.be.eql(false);
      expect(fn("")).to.be.eql(false);
    });
  });

  describe("isString", function() {
    var fn = _.isString;

    it("checks if a value is a String", function() {
      expect(fn("")).to.be.eql(true);

      expect(fn(10)).to.be.eql(false);
      expect(fn(function() {})).to.be.eql(false);
      expect(fn({})).to.be.eql(false);
      expect(fn([])).to.be.eql(false);
    });
  });

  describe("#pluck", function() {
    var object = { a: { item: "hello" }, b: { item: "world" } },
        array = [ { item: "hello" }, { item: "world" } ];

    it("plucks values from a collection", function() {
      expect(_.pluck(object, "item")).to.be.eql(["hello", "world"]);
      expect(_.pluck(array, "item")).to.be.eql(["hello", "world"]);
    });
  });

  describe("#map", function() {
    var object = { a: { item: "hello" }, b: { item: "world" } },
        array = [ { item: "hello" }, { item: "world" } ];

    var fn = function(value, key) {
      return [value, key];
    };

    it("runs a function over items in a collection", function() {
      expect(_.map(object, fn)).to.be.eql([
        [{ item: "hello" }, "a"],
        [{ item: "world" }, "b"]
      ]);

      expect(_.map(array, fn)).to.be.eql([
        [{ item: "hello" }, 0],
        [{ item: "world" }, 1]
      ]);
    });

    it("defaults to the identity function", function() {
      expect(_.map(array)).to.be.eql(array);
      expect(_.map(object)).to.be.eql(array);
    });
  });

  describe("#invoke", function() {
    var array = [
      {
        name: "bob",
        toString: function() {
          return "Hi from " + this.name;
        }
      },
      {
        name: "dave",
        toString: function() {
          return "hello from " + this.name;
        }
      }
    ];

    var object = {
      bob: {
        name: "bob",
        toString: function() {
          return "Hi from " + this.name;
        }
      },
      dave: {
        name: "dave",
        toString: function() {
          return "hello from " + this.name;
        }
      }
    };

    it("runs a instance function over items in a collection", function() {
      expect(_.invoke(object, "toString")).to.be.eql([
        "Hi from bob",
        "hello from dave"
      ]);

      expect(_.invoke(array, "toString")).to.be.eql([
        "Hi from bob",
        "hello from dave"
      ]);

      expect(_.invoke([1, 2, 3, 4, 5], Number.prototype.toString)).to.be.eql([
        "1", "2", "3", "4", "5"
      ]);
    });
  });

  describe("#each", function() {
    var object = { a: { item: "hello" }, b: { item: "world" } },
        array = [ { item: "hello" }, { item: "world" } ];

    var fn = function(value, key) {
      return [value, key];
    };

    it("runs a function over items in a collection", function() {
      fn = spy();
      _.map(object, fn);

      expect(fn).to.be.calledWith(object.a, "a");
      expect(fn).to.be.calledWith(object.b, "b");

      fn = spy();
      _.map(array, fn);

      expect(fn).to.be.calledWith(array[0], 0);
      expect(fn).to.be.calledWith(array[1], 1);
    });
  });

  describe("#reduce", function() {
    var arr = [1, 2, 3, 4, 5, 6],
        obj = { a: 1, b: 2 };

    function add(sum, n) { return sum + n; }

    it("reduces over a collection with the provided iteratee", function() {
      expect(_.reduce(arr, add, 0)).to.be.eql(21);
      expect(_.reduce(obj, add, 0)).to.be.eql(3);
    });

    it("defaults to the first value for the accumulator", function() {
      var object = {
        a: { name: "hello" },
        b: { name: "world" }
      };

      expect(_.reduce(arr, add)).to.be.eql(21);
      expect(
        _.reduce(object, function(acc, val) {
          acc.name += " " + val.name;
          return acc;
        })
      ).to.be.eql({ name: "hello world"});
    });

    it("supports providing a `this` value", function() {
      var self = {
        toString: function(y) { return y.toString(); }
      };

      var fn = function(acc, val) {
        return acc + this.toString(val);
      };

      expect(_.reduce(arr, fn, 1, self)).to.be.eql("123456");
    });
  });

  describe("#arity", function() {
    it("creates a function that only takes a certain # of args", function() {
      var fn = spy();
      var one = _.arity(fn, 1);
      one("one", "two", "three");
      expect(fn).to.be.calledWith("one");
    });
  });

  describe("#partial", function() {
    it("partially applies a function's arguments", function() {
      var fn = spy();
      var one = _.partial(fn, "one", "two");
      one("three");
      expect(fn).to.be.calledWith("one", "two", "three");
    });
  });

  describe("#partialRight", function() {
    it("partially applies arguments to the end of a fn call", function() {
      var fn = spy();
      var one = _.partialRight(fn, "two", "three");
      one("one");
      expect(fn).to.be.calledWith("one", "two", "three");
    });
  });

  describe("#includes", function() {
    it("checks if an array includes a value", function() {
      var fn = _.includes;

      var arr = [1, "2", 3];

      expect(fn(arr, 1)).to.be.eql(true);
      expect(fn(arr, "2")).to.be.eql(true);
      expect(fn(arr, {})).to.be.eql(false);
    });
  });
});
