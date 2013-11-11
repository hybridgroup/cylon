(function() {
  'use strict';
  var Driver;

  source("device");

  source("robot");

  Driver = source("test/driver");

  describe("Device", function() {
    var device, driver, requireDriver, robot;
    robot = new Cylon.Robot({
      name: 'me'
    });
    driver = new Driver({
      name: 'driving'
    });
    requireDriver = sinon.stub(robot, 'requireDriver').returns(driver);
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
    return it("should require a driver", function() {
      return requireDriver.should.be.called;
    });
  });

}).call(this);
