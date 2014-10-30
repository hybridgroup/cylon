/*
 * Test adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Adaptor = require('../adaptor'),
    Utils = require('../utils');

var TestAdaptor;

module.exports = TestAdaptor = function TestAdaptor() {
  TestAdaptor.__super__.constructor.apply(this, arguments);
};

Utils.subclass(TestAdaptor, Adaptor);

TestAdaptor.adaptors = ['test'];
TestAdaptor.adaptor = function(opts) { return new TestAdaptor(opts); };
