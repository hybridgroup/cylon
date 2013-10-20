'use strict';

Device = source("device")

describe "basic tests", ->
  r = new Device(name: "devisive")

  it "device should have a name", ->
    r.should.have.keys 'name'
    r.name.should.be.equal 'devisive'
