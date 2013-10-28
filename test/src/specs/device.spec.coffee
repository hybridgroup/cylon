'use strict';

Device = source("device")
Driver = source("driver")
Robot = source("robot")

describe "Device", ->
  robot = new Robot(name: 'me')
  driver = new Driver(name: 'driving')
  requireDriver = sinon.stub(robot, 'requireDriver').returns(driver)
  device = new Device(name: "devisive", driver: 'driving', robot: robot)

  it "should belong to a robot", ->
    device.robot.name.should.be.equal 'me'

  it "should have a name", ->
    device.name.should.be.equal 'devisive'

  it "should use default connection if none specified"
  it "should use connection if one is specified"

  it "should require a driver", ->
    requireDriver.should.be.called
