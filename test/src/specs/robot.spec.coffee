'use strict';

Robot = source("robot")

describe "basic tests", ->
  testWork = ->
    console.log "hi"

  robot = new Robot(name: "irobot", work: testWork)

  it "robot should have a name, if given", ->
    robot.name.should.be.equal 'irobot'

  it "robot should have a random name, if not given", ->
    sinon.stub(Robot, 'randomName').returns('Electra')
    r = new Robot
    r.name.should.be.equal 'Electra'

  it "robot should have work", ->
    robot.work.should.be.equal testWork

  it "robot should be able to start", ->
    startConnections = sinon.stub(robot, 'startConnections')
    startDevices = sinon.stub(robot, 'startDevices')
    robot.start()
    startConnections.should.have.been.called
    startDevices.should.have.been.called
