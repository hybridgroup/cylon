/* jshint expr:true */
"use strict";

var Adaptor = source("adaptor"),
    Utils = source("utils");

describe("Adaptor", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new Adaptor({ name: "adaptor" });
  });

  describe("#constructor", function() {
    it("sets @name to the provided name", function() {
      expect(adaptor.name).to.be.eql("adaptor");
    });
  });

  describe("#interface methods", function() {
    var child;

    var Child = function Child() {};

    Utils.subclass(Child, Adaptor);

    beforeEach(function() {
      child = new Child();
    });

    describe("#connect", function() {
      it("throws an error unless overwritten", function() {
        expect(child.connect).to.throw();
        child.connect = function() {};
        expect(child.connect).to.not.throw();
      });
    });

    describe("#disconnect", function() {
      it("throws an error unless overwritten", function() {
        expect(child.disconnect).to.throw();
        child.disconnect = function() {};
        expect(child.disconnect).to.not.throw();
      });
    });
  });
});
