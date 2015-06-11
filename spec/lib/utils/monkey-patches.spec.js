// jshint expr:true
"use strict";

var patches = lib("utils/monkey-patches");

describe("monkey-patches", function() {
  beforeEach(function() {
    patches.uninstall();
  });

  afterEach(function() {
    patches.install();
  });

  describe("#install", function() {
    it("monkey-patches methods onto global classes", function() {
      var proto = Number.prototype;

      expect(proto.seconds).to.be.undefined;
      expect(proto.second).to.be.undefined;

      patches.install();

      expect(proto.seconds).to.be.a("function");
      expect(proto.second).to.be.a("function");
    });
  });

  describe("#uninstall", function() {
    it("removes existing monkey-patching", function() {
      var proto = Number.prototype;

      patches.install();

      expect(proto.seconds).to.be.a("function");
      expect(proto.second).to.be.a("function");

      patches.uninstall();

      expect(proto.seconds).to.be.undefined;
      expect(proto.second).to.be.undefined;
    });
  });

  describe("Number", function() {
    beforeEach(function() {
      patches.install();
    });

    describe("#seconds", function() {
      it("allows for expressing time in seconds", function() {
        expect((5).seconds()).to.be.eql(5000);
      });
    });

    describe("#second", function() {
      it("allows for expressing time in seconds", function() {
        expect((1).second()).to.be.eql(1000);
      });
    });

    describe("#fromScale", function() {
      it("converts a value from one scale to 0-1 scale", function() {
        expect((5).fromScale(0, 10)).to.be.eql(0.5);
      });

      it("converts floats", function() {
        expect((2.5).fromScale(0, 10)).to.be.eql(0.25);
      });

      context("if the number goes above the top of the scale", function() {
        it("should return 1", function() {
          expect((15).fromScale(0, 10)).to.be.eql(1);
        });
      });

      context("if the number goes below the bottom of the scale", function() {
        it("should return 0", function() {
          expect((15).fromScale(0, 10)).to.be.eql(1);
          expect((5).fromScale(10, 20)).to.be.eql(0);
        });
      });
    });

    describe("#toScale", function() {
      it("converts a value from 0-1 scale to another", function() {
        expect((0.5).toScale(0, 10)).to.be.eql(5);
      });

      context("when value goes below bottom of scale", function() {
        it("returns the bottom of the scale", function() {
          expect((-5).toScale(0, 10)).to.be.eql(0);
        });
      });

      context("when value goes above top of scale", function() {
        it("returns the top of the scale", function() {
          expect((15).toScale(0, 10)).to.be.eql(10);
        });
      });

      it("converts to floats", function() {
        expect((0.25).toScale(0, 10)).to.be.eql(2.5);
      });

      it("can be chained with #fromScale", function() {
        var num = (5).fromScale(0, 20).toScale(0, 10);
        expect(num).to.be.eql(2.5);
      });
    });
  });
});
