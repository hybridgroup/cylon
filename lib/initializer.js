/*
 * Device/Connection Initializer
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Registry = require("./registry"),
    Config = require("./config");

function testMode() {
  return process.env.NODE_ENV === "test" && Config.testMode;
}

module.exports = function Initializer(type, opts) {
  var mod, name, prop;

  mod = Registry.findBy(type, opts[type]);

  if (!mod) {
    if (opts.module) {
      Registry.register(opts.module);
    } else {
      Registry.register("cylon-" + opts[type]);
    }

    mod = Registry.findBy(type, opts[type]);
  }

  var obj = mod[type](opts);

  for (name in obj) {
    prop = obj[name];

    if (name === "constructor") {
      continue;
    }

    if (typeof prop === "function") {
      obj[name] = prop.bind(obj);
    }
  }

  if (testMode()) {
    var test = Registry.findBy(type, "test")[type](opts);

    for (name in obj) {
      prop = obj[name];

      if (typeof prop === "function" && !test[name]) {
        test[name] = function() { return true; };
      }
    }

    return test;
  }

  return obj;
};
