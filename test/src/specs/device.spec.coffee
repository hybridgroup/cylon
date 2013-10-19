'use strict';

Device = source("device")

describe "basic tests", ->
  r = new Device("irobot")

  it "device should have a name", ->
    r.should.have.keys 'name'
    r.name.should.be.equal 'irobot'
