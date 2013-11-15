(function() {
  'use strict';
  source("test/adaptor");

  describe("Adaptor", function() {
    var adaptor;
    adaptor = new Cylon.Adaptor({
      name: "adaptive"
    });
    it("should have a name", function() {
      adaptor.should.have.keys('name');
      return adaptor.name.should.be.equal('adaptive');
    });
    it("should be able to connect");
    return it("should be able to disconnect");
  });

}).call(this);
