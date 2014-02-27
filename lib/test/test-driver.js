/*
 * Test driver
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var namespace = require('node-namespace');

module.exports = {
  driver: function(opts) {
    return new Cylon.Drivers.TestDriver(opts);
  }
};

namespace("Cylon.Drivers", function() {
  this.TestDriver = (function(klass) {
    subclass(TestDriver, klass);

    function TestDriver(opts) {
      if (opts == null) {
        opts = {};
      }
      TestDriver.__super__.constructor.apply(this, arguments);
    }

    return TestDriver;

  })(Cylon.Driver);
});
