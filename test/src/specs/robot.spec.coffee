'use strict';

source "robot"
source "logger"

Logger.setup(false) # quiet logger for tests

describe "Robot", ->
  testWork = -> Logger.info "hi"
  whateverFunc = -> Logger.info "whatever!"

  robot = new Cylon.Robot
    name: "irobot"
    work: testWork
    whatever: whateverFunc

  it "has a name, if given", ->
    robot.name.should.be.equal 'irobot'

  it "has a random name, if not given", ->
    sinon.stub(Cylon.Robot, 'randomName').returns('Electra')
    r = new Cylon.Robot
    r.name.should.be.equal 'Electra'

  it "has work", ->
    robot.work.should.be.equal testWork

  it "can start work", ->
    startConnections = sinon.spy(robot, 'startConnections')
    startDevices = sinon.spy(robot, 'startDevices')
    work = sinon.stub(robot, 'work')
    robot.start()
    startConnections.should.have.been.called
    startDevices.should.have.been.called
    work.should.have.been.called

  it "has additional functions attached to the robot", ->
    Logger.info robot
    robot.whatever.should.be.equal whateverFunc

  describe '#toString', ->
    it 'returns basic information about the robot', ->
      robot.toString().should.be.equal "[Robot name='irobot']"
