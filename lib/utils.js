/*
 * Cylon - Utils
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

var Utils = module.exports = {
  // Public: Alias to setInterval, combined with Number monkeypatches below to
  // create an artoo-like syntax.
  //
  // interval - interval to run action on
  // action - action to perform at interval
  //
  // Examples
  //
  //   every((5).seconds(), function() {
  //     console.log('Hello world (and again in 5 seconds)!');
  //   });
  //
  // Returns an interval
  every: function every(interval, action) {
    return setInterval(action, interval);
  },

  // Public: Alias to setTimeout, combined with Number monkeypatches below to
  // create an artoo-like syntax.
  //
  // interval - interval to run action on
  // action - action to perform at interval
  //
  // Examples
  //
  //   after((10).seconds(), function() {
  //     console.log('Hello world from ten seconds ago!');
  //   });
  //
  // Returns an interval
  after: function after(delay, action) {
    return setTimeout(action, delay);
  },

  // Public: Alias to the `every` function, but passing 0
  // Examples
  //
  //   constantly(function() {
  //     console.log('hello world (and again and again)!');
  //   });
  //
  // Returns an interval
  constantly: function constantly(action) {
    return every(0, action);
  },

  // Public: Sleep - do nothing for some duration of time.
  //
  // ms - number of ms to sleep for
  //
  // Examples
  //
  //   sleep((1).second());
  //
  // Returns a function
  sleep: function sleep(ms) {
    var start = Date.now();

    while(Date.now() < start + ms) {
      var i = 0;
    }
  },

  // Public: Function to use for class inheritance. Copy of a CoffeeScript helper
  // function.
  //
  // Example
  //
  //    var Sphero = function Sphero() {};
  //
  //    subclass(Sphero, ParentClass);
  //
  //    // Sphero is now a subclass of Parent, and can access parent methods
  //    // through Sphero.__super__
  //
  // Returns subclass
  subclass: function subclass(child, parent) {
    var ctor = function() {
      this.constructor = child;
    };

    for (var key in parent) {
      if (Object.hasOwnProperty.call(parent, key)) {
        child[key] = parent[key];
      }
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  },

  proxyFunctions: function proxyFunctions(source, target) {
    for (var opt in source) {
      if (!target[opt] && typeof source[opt] === 'function') {
        target[opt] = source[opt].bind(source);
      }
    }
  },

  // Public: Proxies a list of methods from one object to another. It will not
  // overwrite existing methods unless told to.
  //
  // methods - array of functions to proxy
  // target - object to proxy the functions to
  // base - (optional) object that proxied functions will be declared on. Defaults
  //       to this
  // force - (optional) boolean - whether or not to force method assignment
  //
  // Returns base
  proxyFunctionsToObject: function proxyFunctionsToObject(methods, target, base, force) {
    if (base == null) {
      base = this;
    }

    if (force == null) {
      force = false;
    }

    var proxy = function(method) {
      return base[method] = function() {
        return target[method].apply(target, arguments);
      };
    };

    for (var i = 0; i < methods.length; i++) {
      var method = methods[i];

      if (!force && typeof(base[method]) === 'function') {
        continue;
      }

      proxy(method);
    }
    return base;
  },

  // Public: Analogue to Ruby's Hash#fetch method for looking up object
  // properties.
  //
  // obj - object to do property lookup on
  // property - string property name to attempt to look up
  // fallback - either:
  //    - a fallback value to return if `property` can't be found
  //    - a function to be executed if `property` can't be found. The function
  //    will be passed `property` as an argument.
  //
  //  Examples
  //
  //    var object = { property: "hello world" };
  //    fetch(object, "property");
  //    //=> "hello world"
  //
  //    fetch(object, "notaproperty", "default value");
  //    //=> "default value"
  //
  //    var notFound = function(prop) { return prop + " not found!" };
  //    fetch(object, "notaproperty", notFound)
  //    // "notaproperty not found!"
  //
  //    var badFallback = function(prop) { prop + " not found!" };
  //    fetch(object, "notaproperty", badFallback)
  //    // Error: no return value from provided callback function
  //
  //    fetch(object, "notaproperty");
  //    // Error: key not found: "notaproperty"
  //
  // Returns the value of obj[property], a fallback value, or the results of
  // running 'fallback'. If the property isn't found, and 'fallback' hasn't been
  // provided, will throw an error.
  fetch: function(obj, property, fallback) {
    if (obj.hasOwnProperty(property)) {
      return obj[property];
    }

    if (fallback === void 0) {
      throw new Error('key not found: "' + property + '"');
    }

    if (typeof(fallback) === 'function') {
      var value = fallback(property);

      if (value === void 0) {
        throw new Error('no return value from provided fallback function');
      }

      return value;
    }

    return fallback;
  },

  // Public: Given a name, and an array of existing names, returns a unique
  // name.
  //
  // name - name that's colliding with existing names
  // arr - array of existing names
  //
  // Returns the new name as a string
  makeUnique: function(name, arr) {
    var newName;

    if (!~arr.indexOf(name)) {
      return name;
    }

    for (var n = 1; ; n++) {
      newName = name + "-" + n;
      if (!~arr.indexOf(newName)) {
        return newName;
      }
    }
  },

  // Public: Adds necessary utils to global namespace, along with base class
  // extensions.
  //
  // Examples
  //
  //    Number.prototype.seconds // undefined
  //    after                    // undefined
  //
  //    Utils.bootstrap();
  //
  //    Number.prototype.seconds // [function]
  //    (after === Utils.after)  // true
  //
  // Returns Cylon.Utils
  bootstrap: function bootstrap() {
    global.every = this.every;
    global.after = this.after;
    global.constantly = this.constantly;

    addCoreExtensions();

    return this;
  }
};

var addCoreExtensions = function addCoreExtensions() {
  // Public: Monkey-patches Number to have Rails-like //seconds() function.
  // Warning, due to the way the Javascript parser works, applying functions on
  // numbers is kind of weird. See examples for details.
  //
  // Examples
  //
  //   2.seconds()
  //   //=> SyntaxError: Unexpected token ILLEGAL
  //
  //   10..seconds()
  //   //=> 10000
  //
  //   (5).seconds()
  //   //=> 5000
  //   // This is the preferred way to represent numbers when calling these
  //   // methods on them
  //
  // Returns an integer representing time in milliseconds
  Number.prototype.seconds = function() {
    return this * 1000;
  };

  // Public: Alias for Number::seconds, see comments for that method
  //
  // Examples
  //
  //   1.second()
  //   //=> 1000
  //
  // Returns an integer representing time in milliseconds
  Number.prototype.second = function() {
    return this.seconds(this);
  };

  // Public: Convert value from old scale (start, end) to (0..1) scale
  //
  // start - low point of scale to convert value from
  // end - high point of scale to convert value from
  //
  // Examples
  //
  //   (5).fromScale(0, 10)
  //   //=> 0.5
  //
  // Returns an integer representing the scaled value
  Number.prototype.fromScale = function(start, end) {
    var val = (this - Math.min(start, end)) / (Math.max(start, end) - Math.min(start, end));

    if (val > 1) {
      return 1;
    }

    if (val < 0){
      return 0;
    }

    return val;
  };

  // Public: Convert value from (0..1) scale to new (start, end) scale
  //
  // start - low point of scale to convert value to
  // end - high point of scale to convert value to
  //
  // Examples
  //
  //   (0.5).toScale(0, 10)
  //   //=> 5
  //
  // Returns an integer representing the scaled value
  Number.prototype.toScale = function(start, end) {
    var i = this * (Math.max(start, end) - Math.min(start, end)) + Math.min(start, end);

    if (i < start) {
      return start;
    }

    if (i > end) {
      return end;
    }

    return i;
  };
};

Utils.bootstrap();
