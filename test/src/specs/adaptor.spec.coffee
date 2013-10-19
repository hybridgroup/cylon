'use strict';

Adaptor = source("adaptor")

describe "basic tests", ->
  r = new Adaptor("irobot")

  it "adaptor should have a name", ->
    r.should.have.keys 'name'
    r.name.should.be.equal 'irobot'
