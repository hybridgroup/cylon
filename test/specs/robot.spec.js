(function() {
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
      return robot.name.should.be.equal('irobot');
    });
    it("has a random name, if not given", function() {
      var r;
      sinon.stub(Cylon.Robot, 'randomName').returns('Electra');
      r = new Cylon.Robot;
      return r.name.should.be.equal('Electra');
    });
    it("has work", function() {
      return robot.work.should.be.equal(testWork);
    });
    it("can start work", function() {
      var startConnections, startDevices, work;
      startConnections = sinon.spy(robot, 'startConnections');
      startDevices = sinon.spy(robot, 'startDevices');
      work = sinon.stub(robot, 'work');
      robot.start();
      startConnections.should.have.been.called;
      startDevices.should.have.been.called;
      return work.should.have.been.called;
    });
    it("has additional functions attached to the robot", function() {
      Logger.info(robot);
      return robot.whatever.should.be.equal(whateverFunc);
    });
    return describe('#toString', function() {
      return it('returns basic information about the robot', function() {
        return robot.toString().should.be.equal("[Robot name='irobot']");
      });
    });
  });

}).call(this);
