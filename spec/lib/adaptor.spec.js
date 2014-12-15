/* jshint expr:true */
"use strict";

var Adaptor = source("adaptor");

describe("Adaptor", function() {
  var adaptor = new Adaptor({ name: "adaptor" });

  describe("#constructor", function() {
    it("sets @name to the provided name", function() {
      expect(adaptor.name).to.be.eql("adaptor");
    });
  });
});
