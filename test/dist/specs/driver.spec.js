(function() {
  'use strict';
  source("test/driver");

  describe("Driver", function() {
    var driver;
    driver = new Cylon.Driver({
      name: "driving"
    });
    return it("should have a name", function() {
      return driver.name.should.be.equal('driving');
    });
  });

}).call(this);
