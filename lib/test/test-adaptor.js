/*
 * Test adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var namespace = require('node-namespace');

var Adaptor = require('../adaptor')

module.exports = {
  adaptor: function(opts) {
    return new Cylon.Adaptors.TestAdaptor(opts);
  }
};

namespace("Cylon.Adaptors", function() {
  this.TestAdaptor = (function(klass) {
    subclass(TestAdaptor, klass);

    function TestAdaptor(opts) {
      if (opts == null) {
        opts = {};
      }
      TestAdaptor.__super__.constructor.apply(this, arguments);
    }

    return TestAdaptor;

  })(Adaptor);
});
