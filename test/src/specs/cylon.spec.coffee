'use strict';

Cylon = source("cylon")
Robot = source('robot')

describe "Cylon", ->
  it "should create a robot", ->
    assert 'robot' in Object.keys(Cylon)
    robot = Cylon.robot(name: 'caprica six')
    robot.name.should.be.eql 'caprica six'

  describe '#api', ->
    describe 'without arguments', ->
      it "returns the current API configuration", ->
        api_config = Cylon.api()
        assert 'host' in Object.keys(api_config)
        assert 'port' in Object.keys(api_config)

    describe 'with a host and port', ->
      it 'sets the API configuration to what was specified', ->
        api_config = Cylon.api(host: '0.0.0.0', port: '8888')
        api_config.host.should.be.eql "0.0.0.0"
        api_config.port.should.be.eql "8888"

  describe "#robots", ->
    it "returns an array of all robots", ->
      robots = Cylon.robots()
      assert robots instanceof Array
      assert robot instanceof Robot for robot in robots

  describe "#findRobot", ->
    describe "synchronous", ->
      describe "with a valid robot name", ->
        it "returns the robot", ->
          robot = Cylon.findRobot("caprica six")
          assert robot instanceof Robot
          robot.name.should.be.equal "caprica six"

      describe "with an invalid robot name", ->
        it "returns null", ->
          robot = Cylon.findRobot("Tom Servo")
          assert robot is null

    describe "async", ->
      describe "with a valid robot name", ->
        it "passes the robot and an empty error to the callback", ->
          Cylon.findRobot "caprica six", (error, robot) ->
            assert error is undefined
            assert robot instanceof Robot
            robot.name.should.be.equal "caprica six"

      describe "with an invalid robot name", ->
        it "passes no robot and an error message to the callback", ->
          Cylon.findRobot "Tom Servo", (error, robot) ->
            assert robot is null
            assert typeof error is 'object'
            error.error.should.be.eql "No Robot found with the name Tom Servo"

