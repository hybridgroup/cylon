"use strict";

var Ping = source('test/ping');

source("device");
source("robot");

describe("Cylon.Device", function() {
  var robot = new Cylon.Robot({
    name: "TestingBot",
    connection: { name: 'loopback', adaptor: 'loopback' }
  });

  var connection = robot.connections.loopback;

  var driver = new Ping({
    name: 'driver',
    device: { connection: connection, port: 13 }
  })

  var initDriver = stub(robot, 'initDriver').returns(driver);

  var device = new Cylon.Device({
    robot: robot,
    name: "ping",
    pin: 13,
    connection: 'loopback'
  });

  describe("constructor", function() {
    it("sets @self as a circular reference", function() {
      expect(device.self).to.be.eql(device);
    });

    it("sets @robot to the passed robot", function() {
      expect(device.robot).to.be.eql(robot);
    });

    it("sets @name to the passed name", function() {
      expect(device.name).to.be.eql('ping');
    });

    it("sets @pin to the passed pin", function() {
      expect(device.pin).to.be.eql(13);
    });

    it("sets @connection to the specified connection on the Robot", function() {
      expect(device.connection).to.be.eql(connection);
    });

    it("asks the Robot to init a driver", function() {
      expect(device.driver).to.be.eql(driver);
      expect(initDriver).to.be.calledOnce
      initDriver.restore();
    });
  });

  describe("#start", function() {
    before(function() {
      stub(driver, 'start').returns(true);
    });

    after(function() {
      driver.start.restore();
    });

    it("starts the driver, passing along a callback", function() {
      var callback = function() { };

      device.start(callback);

      expect(driver.start).to.be.calledWith(callback);
    });

    it("logs that it's starting the device", function() {
      stub(Logger, 'info');
      var message = "Starting device ping on pin 13";

      device.start()

      expect(Logger.info).to.be.calledWith(message);

      Logger.info.restore();
    });
  });

  describe("#halt", function() {
    before(function() {
      stub(driver, 'halt').returns(true);
    });

    after(function() {
      driver.halt.restore();
    });

    it("halts the driver", function() {
      device.halt();
      expect(driver.halt).to.be.called;
    });

    it("logs that it's halt the device", function() {
      var message = "Halting device ping";
      stub(Logger, 'info');

      device.halt();

      expect(Logger.info).to.be.calledWith(message);
      Logger.info.restore();
    });
  });

  describe("#data", function() {
    var data = device.data();

    it("returns an object", function() {
      expect(data).to.be.a('object');
    });

    it("contains the device's name", function() {
      expect(data.name).to.be.eql(device.name);
    });

    it("contains the device's pin", function() {
      expect(data.pin).to.be.eql(device.pin);
    });

    it("contains the device's driver name", function() {
      expect(data.driver).to.be.eql('Ping');
    });

    it("contains the device's connection data", function() {
      expect(data.connection).to.be.eql(device.connection.data());
    });

    it("contains the device's driver commands", function() {
      expect(data.commands).to.be.eql(driver.commands());
    });
  });

  describe("#determineConnection", function() {
    it("returns the connection with the given name from the Robot", function() {
      expect(device.determineConnection("loopback")).to.be.eql(connection);
    });
  });

  describe("#defaultConnection", function() {
    it("returns the first connection found on the robot", function() {
      expect(device.defaultConnection()).to.be.eql(connection);
    });
  });
});
