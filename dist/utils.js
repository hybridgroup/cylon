/*
 * utils
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  global.every = function(interval, action) {
    return setInterval(action, interval);
  };

  global.after = function(delay, action) {
    return setTimeout(action, delay);
  };

  Number.prototype.seconds = function() {
    return this * 1000;
  };

  Number.prototype.second = function() {
    return this.seconds(this);
  };

}).call(this);
