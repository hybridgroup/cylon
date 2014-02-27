(function() {
  'use strict';
  var driver;

  driver = source("driver");

  describe("Cylon.Drivers.<%= adaptorClassName %>", function() {
    var module;
    module = new Cylon.Drivers.<%= adaptorClassName %>({
      device: {
        connection: 'connect'
      }
    });
    return it("needs tests");
  });

}).call(this);
