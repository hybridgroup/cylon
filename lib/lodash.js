"use strict";

// loader for Lo-Dash.
//
// will load the compatability version on JS implementations with less support
// for ES5 features (Tessel, etc)

var isTessel = function() {
  try {
    require("tessel");
    return true;
  } catch (e) {
    return false;
  }
};

if (isTessel()) {
  module.exports = require("lodash/dist/lodash.compat");
} else {
  module.exports = require("lodash");
}
