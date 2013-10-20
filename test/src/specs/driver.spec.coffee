'use strict';

Driver = source("driver")

describe "basic tests", ->
  r = new Driver(name: "driving")

  it "driver should have a name", ->
    r.should.have.keys 'name'
    r.name.should.be.equal 'driving'
