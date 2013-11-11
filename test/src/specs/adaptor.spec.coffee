'use strict';

Adaptor = source("test/adaptor")

describe "Adaptor", ->
  adaptor = new Adaptor(name: "adaptive")

  it "should have a name", ->
    adaptor.should.have.keys 'name'
    adaptor.name.should.be.equal 'adaptive'

  it "should be able to connect"
  it "should be able to disconnect"
