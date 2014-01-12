/*
 * utils
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  var __slice = [].slice;

  global.every = function(interval, action) {
    return setInterval(action, interval);
  };

  global.after = function(delay, action) {
    return setTimeout(action, delay);
  };

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

  Number.prototype.seconds = function() {
    return this * 1000;
  };

  Number.prototype.second = function() {
    return this.seconds(this);
  };

  Number.prototype.fromScale = function(start, end) {
    return (this - Math.min(start, end)) / (Math.max(start, end) - Math.min(start, end));
  };

  Number.prototype.toScale = function(start, end) {
    return Math.ceil(this * (Math.max(start, end) - Math.min(start, end)) + Math.min(start, end));
  };

}).call(this);
