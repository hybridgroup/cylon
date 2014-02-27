/*
 * Loopback adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var namespace = require('node-namespace');

module.exports = {
  adaptor: function(opts) {
    return new Cylon.Adaptors.Loopback(opts);
  }
};

namespace("Cylon.Adaptors", function() {
  this.Loopback = (function(klass) {
    subclass(Loopback, klass);

    function Loopback() {
      _ref = Loopback.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Loopback.prototype.commands = function() {
      return ['ping'];
    };

    return Loopback;

  })(Cylon.Adaptor);
});
