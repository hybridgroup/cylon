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
    connection.robot.name.should.be.equal('me');
  });

  it("has a name", function() {
    connection.name.should.be.equal('connective');
  });

  it("has an adaptor", function() {
    connection.adaptor.name.should.be.equal('loopy');
  });

  it("can init an external adaptor module", function() {
    initAdaptor.should.be.called;
  });

  it("can connect to adaptor", function() {
    var adaptorConnect;
    adaptorConnect = sinon.stub(adaptor, 'connect').returns(true);
    connection.connect();
    adaptorConnect.should.be.called;
  });

  it("can disconnect from adaptor", function() {
    var adaptorDisconnect;
    adaptorDisconnect = sinon.stub(adaptor, 'disconnect').returns(true);
    connection.disconnect();
    adaptorDisconnect.should.be.called;
  });

  describe("#data", function() {
    var data = connection.data();

    it("returns an object", function() {
      expect(data).to.be.a('object');
    });

    it("contains the connection's name", function() {
      expect(data.name).to.be.eql(connection.name);
    });

    it("contains the connection's port", function() {
      expect(data.port).to.be.eql(connection.port.toString());
    });

    it("contains the connection's adaptor name", function() {
      expect(data.adaptor).to.be.eql(connection.adaptor.constructor.name);
    });

    it("contains the connection's ID", function() {
      expect(data.connection_id).to.be.eql(connection.connection_id);
    });
  });
});
