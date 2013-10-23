'use strict';

Robot = source("robot")
source("logger")

Logger.setup(false) # quiet logger for tests

describe "Robot", ->
  testWork = ->
    Logger.info "hi"

  robot = new Robot(name: "irobot", work: testWork)

  it "should have a name, if given", ->
    robot.name.should.be.equal 'irobot'

  it "should have a random name, if not given", ->
    sinon.stub(Robot, 'randomName').returns('Electra')
    r = new Robot
    r.name.should.be.equal 'Electra'

  it "should have work", ->
    robot.work.should.be.equal testWork

  it "should be able to start", ->
    startConnections = sinon.stub(robot, 'startConnections')
    startDevices = sinon.stub(robot, 'startDevices')
    robot.start()
    startConnections.should.have.been.called
    startDevices.should.have.been.called
