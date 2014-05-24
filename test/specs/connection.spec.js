"use strict";

var Robot = source("robot");

describe("Cylon.Connection", function() {
  var robot = new Robot({
    name: "Robby",
    connection: { name: 'loopback', adaptor: 'loopback', port: "/dev/null" }
  });

  var connection = robot.connections.loopback;

  describe("#constructor", function() {
    it("sets @self as a circular reference", function() {
      expect(connection.self).to.be.eql(connection);
    });

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

  describe("#data", function() {
    var data = connection.data();

    it("returns an object", function() {
      expect(data).to.be.an('object');
    });

    it("contains the connection's name", function() {
      expect(data.name).to.be.eql("loopback");
    });

    it("contains the connection's port", function() {
      expect(data.port).to.be.eql("/dev/null");
    });

    it("contains the connection's adaptor name", function() {
      expect(data.adaptor).to.be.eql("Loopback");
    });

    it("contains the connection's ID", function() {
      var id = connection.connection_id;
      expect(data.connection_id).to.be.eql(id);
    });
  });

  describe("#connect", function() {
    var callback = function() { };

    before(function() {
      stub(Logger, 'info').returns(true);
      stub(connection.adaptor, 'connect').returns(true);

      connection.connect(callback);
    });

    after(function() {
      connection.adaptor.connect.restore();
      Logger.info.restore();
    });

    it("logs that it's connecting the device", function() {
      var message = "Connecting to loopback on port /dev/null";
      expect(Logger.info).to.be.calledWith(message);
    });

    it("calls the adaptor's connect method with the provided callback", function() {
      expect(connection.adaptor.connect).to.be.calledWith(callback);
    });
  });

  describe("#disconnect", function() {
    before(function() {
      stub(Logger, 'info').returns(true);
      stub(connection.adaptor, 'disconnect').returns(true);

      connection.disconnect();
    });

    after(function() {
      connection.adaptor.disconnect.restore();
      Logger.info.restore();
    });

    it("logs that it's disconnecting from the device", function() {
      var message = "Disconnecting from loopback on port /dev/null";
      expect(Logger.info).to.be.calledWith(message);
    });

    it("tells the adaptor to disconnect", function() {
      expect(connection.adaptor.disconnect).to.be.called;
    });
  });

  describe("#halt", function() {
    before(function() {
      stub(Logger, 'info').returns(true);
      stub(connection, 'disconnect').returns(true);

      connection.halt();
    });

    after(function() {
      connection.disconnect.restore();
      Logger.info.restore();
    });

    it("logs that it's halting the adaptor", function() {
      var message = "Halting adaptor loopback on port /dev/null";
      expect(Logger.info).to.be.calledWith(message);
    });

    it("tells the connection to disconnect", function() {
      expect(connection.disconnect).to.be.called;
    });
  });
});
