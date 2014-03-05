'use strict';
var Connection, Cylon, Device, Driver, Robot,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Cylon = source("cylon");
Robot = source('robot');
Device = source('device');
Driver = source('driver');
Connection = source('connection');

describe("Cylon", function() {
  it("should create a robot", function() {
    var robot;
    assert(__indexOf.call(Object.keys(Cylon), 'robot') >= 0);
    robot = Cylon.robot({
      name: 'caprica six'
    });
    robot.name.should.be.eql('caprica six');
  });

  describe('#api', function() {
    describe('without arguments', function() {
      it("returns the current API configuration", function() {
        var api_config;
        api_config = Cylon.api();
        assert(__indexOf.call(Object.keys(api_config), 'host') >= 0);
        assert(__indexOf.call(Object.keys(api_config), 'port') >= 0);
      });
    });

    describe('with a host and port', function() {
      it('sets the API configuration to what was specified', function() {
        var api_config;
        api_config = Cylon.api({
          host: '0.0.0.0',
          port: '8888'
        });
        api_config.host.should.be.eql("0.0.0.0");
        api_config.port.should.be.eql("8888");
      });
    });
  });

  describe("#robots", function() {
    it("returns an array of all robots", function() {
      var robot, robots, _i, _len, _results;
      robots = Cylon.robots;
      assert(robots instanceof Array);
      _results = [];
      for (_i = 0, _len = robots.length; _i < _len; _i++) {
        robot = robots[_i];
        _results.push(assert(robot instanceof Robot));
      }
      return _results;
    });
  });

  describe("#findRobot", function() {
    describe("synchronous", function() {
      describe("with a valid robot name", function() {
        it("returns the robot", function() {
          var robot;
          robot = Cylon.findRobot("caprica six");
          assert(robot instanceof Robot);
          robot.name.should.be.equal("caprica six");
        });
      });

      describe("with an invalid robot name", function() {
        it("returns null", function() {
          var robot;
          robot = Cylon.findRobot("Tom Servo");
          assert(robot === null);
        });
      });
    });

    describe("async", function() {
      describe("with a valid robot name", function() {
        it("passes the robot and an empty error to the callback", function() {
          return Cylon.findRobot("caprica six", function(error, robot) {
            assert(error === void 0);
            assert(robot instanceof Robot);
            robot.name.should.be.equal("caprica six");
          });
        });
      });

      describe("with an invalid robot name", function() {
        it("passes no robot and an error message to the callback", function() {
          return Cylon.findRobot("Tom Servo", function(error, robot) {
            assert(robot === null);
            assert(typeof error === 'object');
            error.error.should.be.eql("No Robot found with the name Tom Servo");
          });
        });
      });
    });
  });

  describe("#findRobotDevice", function() {
    var crow;
    crow = Cylon.robot({
      name: "Crow",
      device: {
        name: 'testDevice',
        driver: 'ping'
      }
    });

    describe("synchronous", function() {
      describe("with a valid robot and device name", function() {
        it("returns the device", function() {
          var device;
          device = Cylon.findRobotDevice("Crow", "testDevice");
          assert(device instanceof Device);
          device.name.should.be.equal("testDevice");
        });
      });

      describe("with an invalid device name", function() {
        it("returns null", function() {
          var device;
          device = Cylon.findRobotDevice("Crow", "madethisup");
          assert(device === null);
        });
      });
    });

    describe("async", function() {
      describe("with a valid robot and device name", function() {
        it("passes the device and an empty error to the callback", function() {
          return Cylon.findRobotDevice("Crow", "testDevice", function(error, device) {
            assert(error === void 0);
            assert(device instanceof Device);
            device.name.should.be.equal("testDevice");
          });
        });
      });

      describe("with an invalid device name", function() {
        it("passes no device and an error message to the callback", function() {
          return Cylon.findRobotDevice("Crow", "madethisup", function(err, device) {
            assert(device === null);
            assert(typeof err === 'object');
            err.error.should.be.eql("No device found with the name madethisup.");
          });
        });
      });
    });
  });

  describe("#findRobotConnection", function() {
    var ultron;
    ultron = Cylon.robot({
      name: "Ultron",
      connection: {
        name: 'loopback',
        adaptor: 'loopback'
      }
    });

    describe("synchronous", function() {
      describe("with a valid robot and connection name", function() {
        it("returns the connection", function() {
          var connection;
          connection = Cylon.findRobotConnection("Ultron", "loopback");
          assert(connection instanceof Connection);
          connection.name.should.be.equal("loopback");
        });
      });

      describe("with an invalid connection name", function() {
        it("returns null", function() {
          var connection;
          connection = Cylon.findRobotConnection("Ultron", "madethisup");
          assert(connection === null);
        });
      });
    });

    describe("async", function() {
      describe("with a valid robot and connection name", function() {
        it("passes the connection and an empty error to the callback", function() {
          return Cylon.findRobotConnection("Ultron", "loopback", function(error, conn) {
            assert(error === void 0);
            assert(conn instanceof Connection);
            conn.name.should.be.equal("loopback");
          });
        });
      });

      describe("with an invalid connection name", function() {
        it("passes no connection and an error message to the callback", function() {
          return Cylon.findRobotConnection("Ultron", "madethisup", function(err, conn) {
            var message;
            assert(conn === null);
            assert(typeof err === 'object');
            message = "No connection found with the name madethisup.";
            err.error.should.be.eql(message);
          });
        });
      });
    });
  });
});
