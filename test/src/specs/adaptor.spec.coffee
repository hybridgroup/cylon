'use strict';

Adaptor = source("adaptor")

describe "adaptors", ->
  adaptor = new Adaptor(name: "adaptive")

  it "should have a name", ->
    adaptor.should.have.keys 'name'
    adaptor.name.should.be.equal 'adaptive'
