'use strict';

source "device"
source "robot"
source "test/driver"

describe "Device", ->
  robot = new Cylon.Robot(name: 'me')
  driver = new Cylon.Driver(name: 'driving')
  requireDriver = sinon.stub(robot, 'requireDriver').returns(driver)
  device = new Cylon.Device(name: "devisive", driver: 'driving', robot: robot)

  it "should belong to a robot", ->
    device.robot.name.should.be.equal 'me'

  it "should have a name", ->
    device.name.should.be.equal 'devisive'

  it "should use default connection if none specified"
  it "should use connection if one is specified"

  it "should require a driver", ->
    requireDriver.should.be.called
