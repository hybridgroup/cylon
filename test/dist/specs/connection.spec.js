(function() {
  'use strict';
  var Adaptor, Connection, Robot;

  Connection = source("connection");

  Adaptor = source("adaptor");

  Robot = source("robot");

  describe("Connection", function() {
    var adaptor, connection, requireAdaptor, robot;
    robot = new Robot({
      name: 'me'
    });
    adaptor = new Adaptor({
      name: 'loopback'
    });
    requireAdaptor = sinon.stub(robot, 'requireAdaptor').returns(adaptor);
    connection = new Connection({
      name: "connective",
      adaptor: "loopback",
      robot: robot
    });
    it("should belong to a robot", function() {
      return connection.robot.name.should.be.equal('me');
    });
    it("should have a name", function() {
      return connection.name.should.be.equal('connective');
    });
    it("should have an adaptor", function() {
      return connection.adaptor.name.should.be.equal('loopback');
    });
    it("should be able to require an external adaptor module");
    it("should be able to connect");
    return it("should be able to disconnect");
  });

}).call(this);
