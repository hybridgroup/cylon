(function() {
  'use strict';
  var adaptor;

  adaptor = source("adaptor");

  describe("Cylon.Adaptors.<%= adaptorClassName %>", function() {
    var module;
    module = new Cylon.Adaptors.<%= adaptorClassName %>;
    return it("needs tests");
  });

}).call(this);
