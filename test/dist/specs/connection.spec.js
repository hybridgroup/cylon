(function() {
  'use strict';
  source("connection");

  source("test/adaptor");

  source("robot");

  describe("Connection", function() {
    var adaptor, connection, initAdaptor, robot;
    robot = new Cylon.Robot({
      name: 'me'
    });
    adaptor = new Cylon.Adaptor({
      name: 'loopback'
    });
    initAdaptor = sinon.stub(robot, 'initAdaptor').returns(adaptor);
    connection = new Cylon.Connection({
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
