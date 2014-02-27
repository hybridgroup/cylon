/*
 * utils
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  var __slice = [].slice;

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
  global.every = function(interval, action) {
    return setInterval(action, interval);
  };

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
  global.after = function(delay, action) {
    return setTimeout(action, delay);
  };

  // Public: Alias to the `every` function, but passing 0
  // Examples
  //
  //   constantly -> console.log("hello world (and again and again)!")
  //
  // Returns an interval
  global.constantly = function(action) {
    return every(0, action);
  };

  // Public: Sleep - do nothing for some duration of time.
  //
  // ms - number of ms to sleep for
  //
  // Returns a function
  // Examples:
  //   sleep 1.second()
  global.sleep = function(ms) {
    var i, start, _results;
    start = Date.now();
    _results = [];
    while (Date.now() < start + ms) {
      _results.push(i = 1);
    }
    return _results;
  };

  global.slice = [].slice;

  global.hasProp = {}.hasOwnProperty;

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
  global.subclass = function(child, parent) {
    var ctor, key;
    ctor = function() {
      this.constructor = child;
    };
    for (key in parent) {
      if (hasProp.call(parent, key)) {
        child[key] = parent[key];
      }
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };

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
  global.proxyFunctionsToObject = function(methods, target, base, force) {
    var method, _fn, _i, _len;
    if (base == null) {
      base = this;
    }
    if (force == null) {
      force = false;
    }
    _fn = function(method) {
      return base[method] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return target[method].apply(target, args);
      };
    };
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      method = methods[_i];
      if (!force) {
        if (typeof base[method] === 'function') {
          continue;
        }
      }
      _fn(method);
    }
    return base;
  };

  // Public: Proxies a list of methods for test stubbing.
  //
  // methods - array of functions to proxy
  // base - (optional) object that proxied functions will be declared on. Defaults
  //       to this
  //
  // Returns base
  global.proxyTestStubs = function(methods, base) {
    var method, _i, _len;
    if (base == null) {
      base = this;
    }
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      method = methods[_i];
      base[method] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return true;
      };
      base.commandList.push(method);
    }
    return base;
  };

  // Public: Monkey-patches Number to have Rails-like #seconds() function. Warning,
  // due to the way the Javascript parser works, applying functions on numbers is
  // kind of weird. See examples for details.
  //
  // Examples
  //
  //   2.seconds()
  //   #=> SyntaxError: Unexpected token ILLEGAL
  //
  //   10..seconds()
  //   #=> 10000
  //
  //   (5).seconds()
  //   #=> 5000
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
  //   #=> 1000
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
  //   #=> 0.5
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
  //   #=> 5
  //
  // Returns an integer representing the scaled value
  Number.prototype.toScale = function(start, end) {
    return Math.ceil(this * (Math.max(start, end) - Math.min(start, end)) + Math.min(start, end));
  };

}).call(this);
