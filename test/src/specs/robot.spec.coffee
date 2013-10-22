'use strict';

Robot = source("robot")
RobotActor = source("actors/robot")

describe "robots", ->
  testWork = ->
    console.log "hi"

  robot = new Robot(name: "irobot", work: testWork)

  it "should have a name, if given", ->
    robot.name (name) -> name.should.be.equal 'irobot'

  it "should have a random name, if not given", ->
    sinon.stub(RobotActor, 'randomName').returns('Electra')
    r = new Robot
    r.name (name) -> name.should.be.equal 'Electra'

  it "should have work", ->
    robot.work (work) -> work.should.be.equal testWork

  # it "should be able to start", ->
  #   startConnections = sinon.stub(robot, 'startConnections')
  #   startDevices = sinon.stub(robot, 'startDevices')
  #   robot.start()
  #   startConnections.should.have.been.called
  #   startDevices.should.have.been.called
