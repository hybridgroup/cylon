(function() {
  'use strict';
  source("device");

  source("robot");

  source("driver");

  source("ping");

  describe("Device", function() {
    var device, driver, initDriver, robot;
    robot = new Cylon.Robot({
      name: 'me'
    });
    driver = new Cylon.Drivers.Ping({
      name: 'driving'
    });
    initDriver = sinon.stub(robot, 'initDriver').returns(driver);
    device = new Cylon.Device({
      name: "devisive",
      driver: 'driving',
      robot: robot
    });
    it("should belong to a robot", function() {
      return device.robot.name.should.be.equal('me');
    });
    it("should have a name", function() {
      return device.name.should.be.equal('devisive');
    });
    it("should use default connection if none specified");
    it("should use connection if one is specified");
    return it("should init a driver", function() {
      return initDriver.should.be.called;
    });
  });

}).call(this);
