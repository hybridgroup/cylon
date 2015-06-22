"use strict";

var Registry = require("./registry"),
    Config = require("./config"),
    _ = require("./utils/helpers");

function testMode() {
  return process.env.NODE_ENV === "test" && Config.testMode;
}

module.exports = function Initializer(type, opts) {
  var mod;

  mod = Registry.findBy(type, opts[type]);

  if (!mod) {
    if (opts.module) {
      Registry.register(opts.module);
    } else {
      Registry.register("cylon-" + opts[type]);
    }

    mod = Registry.findBy(type, opts[type]);
  }

  if (!mod) {
    var err = [ "Unable to find", type, "for", opts[type] ].join(" ");
    throw new Error(err);
  }

  var obj = mod[type](opts);

  _.each(obj, function(prop, name) {
    if (name === "constructor") {
      return;
    }

    if (_.isFunction(prop)) {
      obj[name] = prop.bind(obj);
    }
  });

  if (testMode()) {
    var test = Registry.findBy(type, "test")[type](opts);

    _.each(obj, function(prop, name) {
      if (_.isFunction(prop) && !test[name]) {
        test[name] = function() { return true; };
      }
    });

    return test;
  }

  return obj;
};
