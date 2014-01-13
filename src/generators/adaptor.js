var wrench = require('wrench'),
    ejs = require('ejs'),
    glob = require('glob'),
    fs = require('fs'),
    pkg = require('../../package.json'),
    adaptorName = "";

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

var compileTemplates = function() {
  console.log("Compiling templates.");

  glob(cylonAdaptorName() + "/**/*.tpl", function(err, files) {
    files.forEach(function(filename) {
      var templateData = generateTemplateData();

      var newFilename = String(filename)
        .replace(/adaptorName/, cylonAdaptorName())
        .replace(/\.tpl$/, '');

      fs.rename(filename, newFilename, function(err) {
        if (err) { return console.log(err); }

        fs.readFile(newFilename, 'utf8', function(err, contents) {
          if (err) { return console.log(err); }
          var result = ejs.render(contents, templateData);

          fs.writeFile(newFilename, result, function(err) {
            if (err) { return console.log(err); }
          });
        });
      });
    });
  });
};

var generateTemplateData = function() {
  return {
    adaptorName: cylonAdaptorName(),
    adaptorClassName: adaptorClassName(),
    basename: String(adaptorName).toLowerCase(),
    cylonVersion: pkg.version
  };
}

var generator = function(name) {
  adaptorName = name;
  console.log("Creating " + cylonAdaptorName() + " adaptor.");
  wrench.copyDirSyncRecursive(__dirname + "/adaptor", cylonAdaptorName());
  compileTemplates();
};

module.exports = generator;
