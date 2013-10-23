'use strict';

Device = source("device")
Robot = source("robot")

describe "devices", ->
  robot = new Robot(name: 'me')
  device = new Device(name: "devisive", driver: 'driving', robot: robot)

  it "should belong to a robot", ->
    device.robot.name.should.be.equal 'me'

  it "should have a name", ->
    device.name.should.be.equal 'devisive'

  it "should use default connection if none specified"
  it "should use connection if one is specified"
  it "should have an driver"
