/*
 * cylon configuration loader
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  var fetch, namespace;

  namespace = require('node-namespace');

  fetch = function(variable, defaultValue) {
    if (defaultValue == null) {
      defaultValue = false;
    }
    if (process.env[variable] != null) {
      return process.env[variable];
    } else {
      return defaultValue;
    }
  };

  namespace('Config', function() {
    return this.testing_mode = fetch("CYLON_TEST", false);
  });

  module.exports = Config;

}).call(this);
