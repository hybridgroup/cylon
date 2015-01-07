/*
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Registry = require("./registry"),
    Config = require("./config"),
    _ = require("./lodash");

var testMode = function() {
  return process.env.NODE_ENV === "test" && Config.testMode;
};

// Public: Creates a new Device
//
// opts - object containing Device params
//   name - string name of the device
//   pin - string pin of the device
//   robot - parent Robot to the device
//   connection - connection to the device
//   driver - string name of the module the device driver logic lives in
//
// Returns a new Device
module.exports = function Device(opts) {
  var module;

  if (opts.module) {
    module = Registry.register(opts.module);
  } else {
    module = Registry.findByDriver(opts.driver);
  }

  opts.device = this;

  if (!module) {
    Registry.register("cylon-" + opts.driver);
    module = Registry.findByDriver(opts.driver);
  }

  var driver = module.driver(opts);

  _.forIn(driver, function(prop, name) {
    if (name === "constructor") {
      return;
    }

    if (_.isFunction(prop)) {
      driver[name] = prop.bind(driver);
    }
  });

  if (testMode()) {
    var testDriver = Registry.findByDriver("test").driver(opts);

    _.forIn(driver, function(prop, name) {
      if (_.isFunction(prop) && !testDriver[name]) {
        testDriver[name] = function() { return true; };
      }
    });

    return testDriver;
  }

  return driver;
};
