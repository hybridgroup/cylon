/*
 * Repository
 *
 * The Repository contains references to all Drivers and Adaptors Cylon is aware
 * of, along with which module they live in (e.g. cylon-firmata).
 *
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Repository = {};

var search = function(entry, value) {
  for (var name in Repository) {
    var repo = Repository[name];

    if (~repo[entry].indexOf(value)) {
      return repo.module;
    }
  }

  return false;
};

module.exports = {
  register: function(module) {
    var pkg = require(module);

    Repository[module] = {
      module: pkg,
      adaptors: pkg.adaptors,
      drivers: pkg.drivers
    };
  },

  findByAdaptor: function(adaptor) {
    return search("adaptors", adaptor);
  },

  findByDriver: function(driver) {
    return search("drivers", driver);
  },

  // here for tests, should not be publicly used
  _data: Repository
};
