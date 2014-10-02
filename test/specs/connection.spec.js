"use strict";

var Loopback = source('test/loopback'),
    Robot = source("robot"),
    Logger = source('logger'),
    Utils = source('utils');

describe("Connection", function() {
  var robot, connection;

  beforeEach(function() {
    robot = new Robot({
      name: "Robby",
      connection: { name: 'loopback', adaptor: 'loopback', port: "/dev/null" }
    });

    connection = robot.connections.loopback;
  });


  describe("#constructor", function() {
    it("sets @robot to the passed robot", function() {
      expect(connection.robot).to.be.eql(robot);
    });

    it("sets @name to the passed name", function() {
      expect(connection.name).to.be.eql('loopback');
    });

    it("sets @port to the passed port", function() {
      expect(connection.port.toString()).to.be.eql("/dev/null");
    });

  });

  describe("#toJSON", function() {
    var json;

    beforeEach(function() {
      json = connection.toJSON();
    });

    it("returns an object", function() {
      expect(json).to.be.an('object');
    });

    it("contains the connection's name", function() {
      expect(json.name).to.be.eql("loopback");
    });

    it("contains the connection's port", function() {
      expect(json.details.port).to.be.eql("/dev/null");
    });

    it("contains the connection's adaptor name", function() {
      expect(json.adaptor).to.be.eql("Loopback");
    });
  });

  describe("#connect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      Loopback.prototype.test = function() { return "Test" };

      stub(Logger, 'info').returns(true);
      connection.adaptor.connect = stub();

      connection.connect(callback);
    });

    afterEach(function() {
      Logger.info.restore();
      delete Loopback.prototype.test;
    })

    it("logs that it's connecting the device", function() {
      var message = "Connecting to 'loopback' on port /dev/null.";
      expect(Logger.info).to.be.calledWith(message);
    });

    it("triggers the provided callback after the adaptor finishes connecting", function() {
      expect(callback).to.not.be.called;
      connection.adaptor.connect.yield();
      expect(callback).to.be.called;
    });

    it("proxies methods from the Adaptor", function() {
      connection.adaptor.connect.yield();
      expect(connection.test()).to.be.eql("Test");
    })
  });

  describe("#disconnect", function() {
    beforeEach(function() {
      stub(Logger, 'info').returns(true);
      stub(connection, 'removeAllListeners');

      connection.adaptor.disconnect = stub().returns(true);

      connection.disconnect();
    });

    afterEach(function() {
      connection.removeAllListeners.restore();
      Logger.info.restore();
    });

    it("logs that it's disconnecting from the device", function() {
      var message = "Disconnecting from 'loopback' on port /dev/null.";
      expect(Logger.info).to.be.calledWith(message);
    });

    it("tells the adaptor to disconnect", function() {
      expect(connection.adaptor.disconnect).to.be.called;
    });

    it("disconnects all event listeners", function() {
      expect(connection.removeAllListeners).to.be.called;
    });
  });
});
