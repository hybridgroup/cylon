/*
 * Registry
 *
 * The Registry contains references to all Drivers and Adaptors Cylon is aware
 * of, along with which module they live in (e.g. cylon-firmata).
 *
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Logger = require('./logger');

// Explicitly these modules here, so Browserify can grab them later
require('./test/loopback');
require('./test/test-adaptor');
require('./test/test-driver');
require('./test/ping');

var missingModuleError = function(module) {
  var string = "Cannot find the '" + module + "' module.\n";
  string += "This problem might be fixed by installing it with 'npm install " + module + "' and trying again.";

  console.log(string);

  process.emit('SIGINT');
};

var Registry = module.exports = {
  data: {},

  register: function(module) {
    if (this.data[module]) {
      return;
    }

    var pkg;

    try {
      pkg = require(module);
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        missingModuleError(module);
      }

      throw e;
    }

    this.data[module] = {
      module: pkg,
      adaptors: pkg.adaptors || [],
      drivers: pkg.drivers || [],
      dependencies: pkg.dependencies || []
    };

    this.logRegistration(module, this.data[module]);

    this.data[module].dependencies.forEach(function(dep) {
      Registry.register(dep);
    });

    return this.data[module].module;
  },

  findByAdaptor: function(adaptor) {
    return this.search("adaptors", adaptor);
  },

  findByDriver: function(driver) {
    return this.search("drivers", driver);
  },

  findByModule: function(module) {
    if (!this.data[module]) {
      return null;
    }

    return this.data[module].module;
  },

  logRegistration: function(name) {
    var module = this.data[name];

    Logger.debug("Registering module " + name);

    ['adaptors', 'drivers', 'dependencies'].forEach(function(field) {
      if (module[field].length) {
        Logger.debug("  " + field + ":");
        module[field].forEach(function(item) {
          Logger.debug("    - " + item);
        });
      }
    });
  },

  search: function(entry, value) {
    for (var name in this.data) {
      var repo = this.data[name];

      if (~repo[entry].indexOf(value)) {
        return repo.module;
      }
    }

    return false;
  }
};

// Default drivers/adaptors:
['loopback', 'ping', 'test-adaptor', 'test-driver'].forEach(function(module) {
  Registry.register('./test/' + module);
});
