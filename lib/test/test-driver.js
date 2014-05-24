/*
 * Test driver
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Driver = require('../driver');

var TestDriver;

module.exports = TestDriver = function TestDriver() {
  TestDriver.__super__.constructor.apply(this, arguments);
};

subclass(TestDriver, Driver);

TestDriver.driver = function(opts) { return new TestDriver(opts); };
