"use strict";

var Ping = source('test/ping'),
    Device = source("device"),
    Robot = source("robot"),
    Logger = source('logger'),
    Utils = source('utils');

describe("Device", function() {
  var robot, connection, driver, device, initDriver;

  beforeEach(function() {
    robot = new Robot({
      name: "TestingBot",
      connection: { name: 'loopback', adaptor: 'loopback' }
    });

    connection = robot.connections.loopback;

    driver = new Ping({
      name: 'driver',
      device: { connection: connection, port: 13 }
    });

    driver.cmd = spy();
    driver.string = "";
    driver.robot = spy();

    initDriver = stub(Device.prototype, 'initDriver').returns(driver);

    device = new Device({
      robot: robot,
      name: "ping",
      pin: 13,
      connection: 'loopback'
    });
  });

  afterEach(function() {
    initDriver.restore();
  });

  describe("constructor", function() {
    it("sets @robot to the passed robot", function() {
      expect(device.robot).to.be.eql(robot);
    });

    it("sets @name to the passed name", function() {
      expect(device.name).to.be.eql('ping');
    });

    it("sets @pin to the passed pin", function() {
      expect(device.pin).to.be.eql(13);
    });

    it("sets @connection to the name of the specified connection on the Robot", function() {
      expect(device.connection).to.be.eql(connection);
    });

    it("asks the Robot to init a driver", function() {
      expect(device.driver).to.be.eql(driver);
      expect(initDriver).to.be.calledOnce
    });

    it("does not override existing functions", function() {
      expect(device.robot).to.not.be.a('function');
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(Logger, 'info');
      driver.start = stub();

      device.start(callback);
    });

    afterEach(function() {
      Logger.info.restore();
    });

    it("logs that it's starting the device", function() {
      var message = "Starting device 'ping' on pin 13.";
      expect(Logger.info).to.be.calledWith(message);
    });

    it("triggers the provided callback after the adaptor finishes connecting", function() {
      expect(callback).to.not.be.called;
      driver.start.yield();
      expect(callback).to.be.called;
    });

    it("binds driver methods to the device", function() {
      driver.start.yield();
      device.cmd();
      expect(driver.cmd).to.be.called;
    });
  });

  describe("#halt", function() {
    beforeEach(function() {
      stub(Logger, 'info');

      driver.halt = stub().returns(true);
      device.removeAllListeners = spy();

      device.halt();
    });

    afterEach(function() {
      Logger.info.restore();
    });

    it("halts the driver", function() {
      expect(driver.halt).to.be.called;
    });

    it("logs that it's halt the device", function() {
      var message = "Halting device 'ping'.";

      expect(Logger.info).to.be.calledWith(message);
    });

    it("disconnects all event listeners", function() {
      expect(device.removeAllListeners).to.be.called;
    });
  });

  describe("#toJSON", function() {
    var json;

    beforeEach(function() {
      json = device.toJSON();
    });

    it("returns an object", function() {
      expect(json).to.be.a('object');
    });

    it("contains the device's name", function() {
      expect(json.name).to.be.eql(device.name);
    });

    it("contains the device's pin", function() {
      expect(json.details.pin).to.be.eql(device.pin);
    });

    it("contains the device's driver name", function() {
      expect(json.driver).to.be.eql('Ping');
    });

    it("contains the device's connection name", function() {
      expect(json.connection).to.be.eql('loopback');
    });

    it("contains the device's driver commands", function() {
      expect(json.commands).to.be.eql(Object.keys(driver.commands));
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
