(function() {
  'use strict';
  source("device");

  source("robot");

  source("driver");

  source("test/ping");

  describe("Device", function() {
    var device, driver, initDriver, robot;
    robot = new Cylon.Robot({
      name: 'me'
    });
    driver = new Cylon.Drivers.Ping({
      name: 'driving',
      device: {
        connection: 'connect',
        pin: 13
      }
    });
    initDriver = sinon.stub(robot, 'initDriver').returns(driver);
    device = new Cylon.Device({
      name: "devisive",
      driver: 'driving',
      robot: robot
    });
    it("belongs to a robot", function() {
      return device.robot.name.should.be.equal('me');
    });
    it("has a name", function() {
      return device.name.should.be.equal('devisive');
    });
    it("can init a driver", function() {
      return initDriver.should.be.called;
    });
    it("can start a driver", function() {
      var driverStart;
      driverStart = sinon.stub(driver, 'start').returns(true);
      device.start();
      return driverStart.should.be.called;
    });
    it("can stop a driver", function() {
      var driverStop;
      driverStop = sinon.stub(driver, 'stop').returns(true);
      device.stop();
      return driverStop.should.be.called;
    });
    it("should use default connection if none specified");
    return it("should use connection if one is specified");
  });

}).call(this);
