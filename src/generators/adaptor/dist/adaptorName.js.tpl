/*
 * <%= adaptorName %>
 * http://cylonjs.com
 *
 * Copyright (c) 2013 Your Name Here
 * Your License Here
*/


(function() {
  'use strict';
  var namespace,
    __slice = [].slice;

  namespace = require('node-namespace');

  require('cylon');

  module.exports = {
    adaptor: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Cylon.Adaptors.<%= adaptorClassName %>, args, function(){});
    },
    driver: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Cylon.Drivers.<%= adaptorClassName %>, args, function(){});
    },
    register: function(robot) {}
  };

}).call(this);
