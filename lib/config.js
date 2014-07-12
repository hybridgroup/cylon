/*
 * cylon configuration loader
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Utils = require('./utils');

module.exports = {
  testing_mode: Utils.fetch(process.env, 'CYLON_TEST', false)
};
