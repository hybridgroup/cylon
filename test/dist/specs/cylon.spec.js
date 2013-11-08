(function() {
  'use strict';
  var Cylon,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Cylon = source("cylon");

  describe("Cylon", function() {
    return it("should create a robot", function() {
      var robot;
      assert(__indexOf.call(Object.keys(Cylon), 'robot') >= 0);
      robot = Cylon.robot({
        name: 'caprica six'
      });
      return robot.name.should.be.eql('caprica six');
    });
  });

}).call(this);
