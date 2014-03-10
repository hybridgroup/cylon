/*
 * utils
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

// Public: Monkey-patches Number to have Rails-like //seconds() function. Warning,
// due to the way the Javascript parser works, applying functions on numbers is
// kind of weird. See examples for details.
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
//   5..fromScale(0, 10)
//   //=> 0.5
//
// Returns an integer representing the scaled value
Number.prototype.fromScale = function(start, end) {
  return (this - Math.min(start, end)) / (Math.max(start, end) - Math.min(start, end));
};

// Public: Convert value from (0..1) scale to new (start, end) scale
//
// start - low point of scale to convert value to
// end - high point of scale to convert value to
//
// Examples
//
//   0.5.toScale(0, 10)
//   //=> 5
//
// Returns an integer representing the scaled value
Number.prototype.toScale = function(start, end) {
  return this * (Math.max(start, end) - Math.min(start, end)) + Math.min(start, end);
};

var Utils = {
  // Public: Alias to setInterval, combined with Number monkeypatches below to
  // create an artoo-like syntax.
  //
  // interval - interval to run action on
  // action - action to perform at interval
  //
  // Examples
  //
  //   every 5.seconds(), -> console.log("hello world (and again in 5 seconds)!")
  //
  // Returns an interval
  every: function(interval, action) {
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
  //   after 10.seconds(), -> console.log("hello world from ten seconds ago!")
  //
  // Returns an interval
  after: function(delay, action) {
    return setTimeout(action, delay);
  },

  // Public: Alias to the `every` function, but passing 0
  // Examples
  //
  //   constantly -> console.log("hello world (and again and again)!")
  //
  // Returns an interval
  constantly: function(action) {
    return every(0, action);
  },

  // Public: Sleep - do nothing for some duration of time.
  //
  // ms - number of ms to sleep for
  //
  // Returns a function
  // Examples:
  //   sleep 1.second()
  sleep: function(ms) {
    var start = Date.now();

    while(Date.now() < start + ms) {
      var i = 0;
    }
  },

  // Copies
  slice: [].slice,
  hasProp: {}.hasOwnProperty,

  // Public: Function to use for class inheritance. Copy of a CoffeeScript helper
  // function.
  //
  // Example
  //
  //   var Sphero = (function(klass) {
  //     subclass(Sphero, klass);
  //     // Sphero is now a subclass of Parent, and can access it's methods through
  //     // Sphero.__super__
  //   })(Parent);
  //
  // Returns subclass
  subclass: function(child, parent) {
    var ctor = function() { this.constructor = child; };

    for (var key in parent) {
      if (hasProp.call(parent, key)) { child[key] = parent[key]; }
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
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
  proxyFunctionsToObject: function(methods, target, base, force) {
    if (base == null) { base = this; }
    if (force == null) { force = false; }

    var fn = function(method) {
      return base[method] = function() {
        var args = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
        return target[method].apply(target, args);
      };
    };

    for (var i = 0; i < methods.length; i++) {
      var method = methods[i];
      if (!force) {
        if (typeof base[method] === 'function') { continue; }
      }

      fn(method);
    }
    return base;
  },

  // Public: Proxies a list of methods for test stubbing.
  //
  // methods - array of functions to proxy
  // base - (optional) object that proxied functions will be declared on. Defaults
  //       to this
  //
  // Returns base
  proxyTestStubs: function(methods, base) {
    if (base == null) { base = this; }

    methods.forEach(function(method) {
      base[method] = function() { return true; };
      base.commandList.push(method);
    });

    return base;
  },

  // Public: Binds an argument to a caller
  //
  // fn - function to bind
  // me - value for 'this' scope inside the function
  //
  // Examples
  //
  //    var me = { hello: "Hello World" };
  //    var proxy = { boundMethod: function() { return this.hello; } };
  //    proxy.boundMethod = bind(proxy.boundMethod, me);
  //    proxy.boundMethod();
  //    //=> "Hello World"
  //
  // Returns a function wrapper
  bind: function(fn, me) {
    return function() { return fn.apply(me, arguments); };
  }
};

// Add all utility functions to global namespace
for (var util in Utils) { global[util] = Utils[util]; }

module.exports = Utils;
