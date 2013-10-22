'use strict';

Device = source("device")

describe "devices", ->
  device = new Device(name: "devisive", driver: 'driving', robot: 'me')

  it "should belong to a robot", ->
    device.robot.should.be.equal 'me'

  it "should have a name", ->
    device.name.should.be.equal 'devisive'

  it "should have a connection"
  it "should have an driver"
