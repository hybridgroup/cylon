'use strict';

require('./globals');

var grunt = require('grunt');
var Mocha = require('mocha');

var mocha = new Mocha({ reporter: 'spec', ui: 'bdd'});

function run(cb) {
  var files = grunt.file.expand(__dirname + '/../dist/**/*.spec.js');
  console.log(files)
  files.forEach(function (file) {
    mocha.addFile(file);
  });

  cb();
}

run(function (err) {
  if (err) { throw err; }
  mocha.run(function (failures) {
    process.exit(failures);
  });
});
