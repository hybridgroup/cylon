'use strict';

source("robot");
source("logger");
Logger.setup(false);

describe("Robot", function() {
  var robot, testWork, whateverFunc;

  testWork = function() {
    return Logger.info("hi");
  };

  whateverFunc = function() {
    return Logger.info("whatever!");
  };

  robot = new Cylon.Robot({
    name: "irobot",
    work: testWork,
    whatever: whateverFunc
  });

  it("has a name, if given", function() {
    robot.name.should.be.equal('irobot');
  });

  it("has a random name, if not given", function() {
    var r;
    sinon.stub(Cylon.Robot, 'randomName').returns('Electra');
    r = new Cylon.Robot;
    r.name.should.be.equal('Electra');
  });

  it("has work", function() {
    robot.work.should.be.equal(testWork);
  });

  it("can start work", function() {
    var startConnections, startDevices, work;
    startConnections = sinon.spy(robot, 'startConnections');
    startDevices = sinon.spy(robot, 'startDevices');
    work = sinon.stub(robot, 'work');
    robot.start();
    startConnections.should.have.been.called;
    startDevices.should.have.been.called;
    work.should.have.been.called;
  });

  it("has additional functions attached to the robot", function() {
    Logger.info(robot);
    robot.whatever.should.be.equal(whateverFunc);
  });

  describe('#toString', function() {
    it('returns basic information about the robot', function() {
      robot.toString().should.be.equal("[Robot name='irobot']");
    });
  });

  describe("#data", function() {
    var dataBot = new Cylon.Robot({
      connection: { name: 'loopback', adaptor: 'loopback' },
      device: { name: 'ping', driver: 'ping' }
    });

    var data = dataBot.data();

    it("returns an object", function() {
      expect(data).to.be.a('object');
    });

    it("contains the robot's name", function() {
      expect(data.name).to.eql(dataBot.name);
    });

    it("contains the robot's commands", function() {
      expect(data.commands).to.eql(dataBot.commands);
    });

    it("contains the robot's devices", function() {
      var deviceData = dataBot.devices.ping.data();
      expect(data.devices).to.eql([deviceData]);
    });

    it("contains the robot's connections", function() {
      var connectionData = dataBot.connections.loopback.data();
      expect(data.connections).to.eql([connectionData]);
    });
  });
});
