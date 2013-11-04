/*
 * Linux IO
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace;

  namespace = require('node-namespace');

  namespace('Cylon', function() {
    return this.IO = (function() {
      function IO(opts) {
        this.self = this;
      }

      return IO;

    })();
  });

}).call(this);
