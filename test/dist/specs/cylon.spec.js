(function() {
  'use strict';
  var Cylon,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Cylon = source("cylon");

  describe("Cylon", function() {
    it("should create a robot", function() {
      var robot;
      assert(__indexOf.call(Object.keys(Cylon), 'robot') >= 0);
      robot = Cylon.robot({
        name: 'caprica six'
      });
      return robot.name.should.be.eql('caprica six');
    });
    return describe('#api', function() {
      describe('without arguments', function() {
        return it("returns the current API configuration", function() {
          var api_config;
          api_config = Cylon.api();
          assert(__indexOf.call(Object.keys(api_config), 'host') >= 0);
          return assert(__indexOf.call(Object.keys(api_config), 'port') >= 0);
        });
      });
      return describe('with a host and port', function() {
        var api_config;
        it('sets the API configuration to what was specified');
        api_config = Cylon.api({
          host: '0.0.0.0',
          port: '8888'
        });
        api_config.host.should.be.eql("0.0.0.0");
        return api_config.port.should.be.eql("8888");
      });
    });
  });

}).call(this);
