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
    it("should have a name, if given", function() {
      return robot.name.should.be.equal('irobot');
    });
    it("should have a random name, if not given", function() {
      var r;
      sinon.stub(Robot, 'randomName').returns('Electra');
      r = new Robot;
      return r.name.should.be.equal('Electra');
    });
    it("should have work", function() {
      return robot.work.should.be.equal(testWork);
    });
    return it("should be able to start", function() {
      var startConnections, startDevices;
      startConnections = sinon.stub(robot, 'startConnections');
      startDevices = sinon.stub(robot, 'startDevices');
      robot.start();
      startConnections.should.have.been.called;
      return startDevices.should.have.been.called;
    });
  });

}).call(this);
