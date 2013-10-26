(function() {
  'use strict';
  var Robot;

  Robot = source("robot");

  source("logger");

  Logger.setup(false);

  describe("Robot", function() {
    var robot, testWork;
    testWork = function() {
      return Logger.info("hi");
    };
    robot = new Robot({
      name: "irobot",
      work: testWork
    });
    it("has a name, if given", function() {
      return robot.name.should.be.equal('irobot');
    });
    it("has a random name, if not given", function() {
      var r;
      sinon.stub(Robot, 'randomName').returns('Electra');
      r = new Robot;
      return r.name.should.be.equal('Electra');
    });
    it("has work", function() {
      return robot.work.should.be.equal(testWork);
    });
    return it("can start work", function() {
      var startConnections, startDevices, work;
      startConnections = sinon.spy(robot, 'startConnections');
      startDevices = sinon.spy(robot, 'startDevices');
      work = sinon.stub(robot, 'work');
      robot.start();
      startConnections.should.have.been.called;
      startDevices.should.have.been.called;
      return work.should.have.been.called;
    });
  });

}).call(this);
