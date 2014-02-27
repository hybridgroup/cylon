/*
 * cylon configuration loader
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var namespace = require('node-namespace');

var fetch = function(variable, defaultValue) {
  if (defaultValue == null) {
    defaultValue = false;
  }
  if (process.env[variable] != null) {
    return process.env[variable];
  } else {
    return defaultValue;
  }
};

namespace('CylonConfig', function() {
  return this.testing_mode = fetch("CYLON_TEST", false);
});

module.exports = CylonConfig;
