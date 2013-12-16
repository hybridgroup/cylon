(function() {
  'use strict';
  source("driver");

  describe("Driver", function() {
    var driver;
    driver = new Cylon.Driver({
      name: 'max',
      device: {
        connection: 'connect',
        pin: 13
      }
    });
    return it('needs tests');
  });

}).call(this);
