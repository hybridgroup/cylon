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
    it("should be able to disconnect");
    it('can alias methods with addProxy()', function() {
      var proxyObject;
      proxyObject = {
        toString: function() {
          return "[object ProxyObject]";
        }
      };
      connection.addProxy(proxyObject, 'toString');
      assert(typeof connection.toString === 'function');
      return connection.toString().should.be.equal("[object ProxyObject]");
    });
    return it('can alias methods with arguments with addProxy()', function() {
      var proxyObject;
      proxyObject = {
        returnString: function(string) {
          return string;
        }
      };
      connection.addProxy(proxyObject, 'returnString');
      assert(typeof connection.returnString === 'function');
      return connection.returnString("testString").should.be.equal("testString");
    });
  });

}).call(this);
