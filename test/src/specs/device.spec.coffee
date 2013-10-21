'use strict';

Device = source("device")

describe "devices", ->
  device = new Device(name: "devisive", driver: 'driving')

  it "should have a name", ->
    device.name.should.be.equal 'devisive'

  it "should have an driver", ->
    device.driver.should.be.equal 'driving'

  it "should be able to require an external driver module"
