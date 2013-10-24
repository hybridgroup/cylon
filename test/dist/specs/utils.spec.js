(function() {
  'use strict';
  var utils;

  utils = source("utils");

  describe("Utils", function() {
    return describe("Monkeypatches Number", function() {
      it("adds seconds() method", function() {
        return 5..seconds().should.be.equal(5000);
      });
      return it("adds second() method", function() {
        return 1..second().should.be.equal(1000);
      });
    });
  });

}).call(this);
