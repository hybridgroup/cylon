'use strict';

source "device"
source "robot"
source "driver"
source "test/ping"

describe "Device", ->
  robot = new Cylon.Robot(name: 'me')
  driver = new Cylon.Drivers.Ping(name: 'driving', device: {connection: 'connect', pin: 13})
  initDriver = sinon.stub(robot, 'initDriver').returns(driver)
  device = new Cylon.Device(name: "devisive", driver: 'driving', robot: robot)

  it "belongs to a robot", ->
    device.robot.name.should.be.equal 'me'

  it "has a name", ->
    device.name.should.be.equal 'devisive'

  it "can init a driver", ->
    initDriver.should.be.called

  it "can start a driver", ->
    driverStart = sinon.stub(driver, 'start').returns(true)
    device.start()
    driverStart.should.be.called

  it "can stop a driver", ->
    driverStop = sinon.stub(driver, 'stop').returns(true)
    device.stop()
    driverStop.should.be.called

  it "should use default connection if none specified"
  it "should use connection if one is specified"
