/*
 * Ping driver
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var namespace = require('node-namespace');

module.exports = {
  driver: function(opts) {
    return new Cylon.Drivers.Ping(opts);
  }
};

namespace("Cylon.Drivers", function() {
  this.Ping = (function(klass) {
    subclass(Ping, klass);

    function Ping() {
      var _ref = Ping.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Ping.prototype.commands = function() {
      return ['ping'];
    };

    Ping.prototype.ping = function() {
      return "pong";
    };

    return Ping;

  })(Cylon.Driver);
});
