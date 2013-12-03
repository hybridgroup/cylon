var wrench = require('wrench');

var adaptorName = "";

// Returns a cylon-namespaced adaptor name
var cylonAdaptorName = function() {
  return "cylon-" + adaptorName;
};

// Converts the adaptor name to from camel_case to snake_case
var adaptorClassName = function() {
  return String(adaptorName)
    .replace(/[\W_]/g, ' ')
    .toLowerCase()
    .replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); })
    .replace(/\s/g, '');
};

var generator = function(name) {
  adaptorName = name;
  console.log("Creating " + cylonAdaptorName() + " adaptor...");
  wrench.copyDirSyncRecursive(__dirname + "/adaptor", cylonAdaptorName());
  console.log("Done!");
};

module.exports = generator;
