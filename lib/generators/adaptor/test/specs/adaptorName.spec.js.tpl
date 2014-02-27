"use strict";

var module = source("<%= adaptorName %>");

describe("Cylon.<%= adaptorClassName %>", function() {
  it("should be able to register", function() {
    expect(module.register).to.be.a('function');
  });

  it("should be able to create adaptor", function() {
    expect(module.adaptor()).to.be.a('object');
  });

  it("should be able to create driver", function() {
    expect(module.adaptor({ device: {} })).to.be.a('object');
  });
});
