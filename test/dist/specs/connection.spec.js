(function() {
  'use strict';
  source("connection");

  source("adaptor");

  source("robot");

  source("test/loopback");

  describe("Connection", function() {
    var adaptor, connection, initAdaptor, robot;
    robot = new Cylon.Robot({
      name: 'me'
    });
    adaptor = new Cylon.Adaptors.Loopback({
      name: 'loopy'
    });
    initAdaptor = sinon.stub(robot, 'initAdaptor').returns(adaptor);
    connection = new Cylon.Connection({
      name: "connective",
      adaptor: "loopback",
      robot: robot
    });
    it("belongs to a robot", function() {
      return connection.robot.name.should.be.equal('me');
    });
    it("has a name", function() {
      return connection.name.should.be.equal('connective');
    });
    it("has an adaptor", function() {
      return connection.adaptor.name.should.be.equal('loopy');
    });
    it("can init an external adaptor module", function() {
      return initAdaptor.should.be.called;
    });
    it("can connect to adaptor", function() {
      var adaptorConnect;
      adaptorConnect = sinon.stub(adaptor, 'connect').returns(true);
      connection.connect();
      return adaptorConnect.should.be.called;
    });
    return it("can disconnect from adaptor", function() {
      var adaptorDisconnect;
      adaptorDisconnect = sinon.stub(adaptor, 'disconnect').returns(true);
      connection.disconnect();
      return adaptorDisconnect.should.be.called;
    });
  });

}).call(this);
