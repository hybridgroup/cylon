'use strict';

Device = source("device")

describe "basic tests", ->
  r = new Device(name: "devisive", driver: 'driving')

  it "device should have a name", ->
    r.name.should.be.equal 'devisive'

  it "device should have an driver", ->
    r.driver.should.be.equal 'driving'
