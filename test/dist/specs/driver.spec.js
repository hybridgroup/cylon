(function() {
  'use strict';
  var Driver;

  Driver = source("driver");

  describe("Driver", function() {
    var driver;
    driver = new Driver({
      name: "driving"
    });
    return it("should have a name", function() {
      return driver.name.should.be.equal('driving');
    });
  });

}).call(this);
