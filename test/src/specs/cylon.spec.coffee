'use strict';

Cylon = source "cylon"
Robot = source 'robot'
Device = source 'device'
Driver = source 'driver'
Connection = source 'connection'

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

  describe "#findRobotDevice", ->
    crow = Cylon.robot({
      name: "Crow"
      device: { name: 'testDevice', driver: 'ping' }
    })

    describe "synchronous", ->
      describe "with a valid robot and device name", ->
        it "returns the device", ->
          device = Cylon.findRobotDevice("Crow", "testDevice")
          assert device instanceof Device
          device.name.should.be.equal "testDevice"

      describe "with an invalid device name", ->
        it "returns null", ->
          device = Cylon.findRobotDevice("Crow", "madethisup")
          assert device is null

    describe "async", ->
      describe "with a valid robot and device name", ->
        it "passes the device and an empty error to the callback", ->
          Cylon.findRobotDevice "Crow", "testDevice", (error, device) ->
            assert error is undefined
            assert device instanceof Device
            device.name.should.be.equal "testDevice"

      describe "with an invalid device name", ->
        it "passes no device and an error message to the callback", ->
          Cylon.findRobotDevice "Crow", "madethisup", (err, device) ->
            assert device is null
            assert typeof err is 'object'
            err.error.should.be.eql "No device found with the name madethisup."

  describe "#findRobotConnection", ->
    ultron = Cylon.robot({
      name: "Ultron",
      connection: { name: 'loopback', adaptor: 'loopback' }
    })

    describe "synchronous", ->
      describe "with a valid robot and connection name", ->
        it "returns the connection", ->
          connection = Cylon.findRobotConnection("Ultron", "loopback")
          assert connection instanceof Connection
          connection.name.should.be.equal "loopback"

      describe "with an invalid connection name", ->
        it "returns null", ->
          connection = Cylon.findRobotConnection("Ultron", "madethisup")
          assert connection is null

    describe "async", ->
      describe "with a valid robot and connection name", ->
        it "passes the connection and an empty error to the callback", ->
          Cylon.findRobotConnection "Ultron", "loopback", (error, conn) ->
            assert error is undefined
            assert conn instanceof Connection
            conn.name.should.be.equal "loopback"

      describe "with an invalid connection name", ->
        it "passes no connection and an error message to the callback", ->
          Cylon.findRobotConnection "Ultron", "madethisup", (err, conn) ->
            assert conn is null
            assert typeof err is 'object'
            message = "No connection found with the name madethisup."
            err.error.should.be.eql message
