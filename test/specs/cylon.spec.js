(function() {
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
      return robot.name.should.be.eql('caprica six');
    });
    describe('#api', function() {
      describe('without arguments', function() {
        return it("returns the current API configuration", function() {
          var api_config;
          api_config = Cylon.api();
          assert(__indexOf.call(Object.keys(api_config), 'host') >= 0);
          return assert(__indexOf.call(Object.keys(api_config), 'port') >= 0);
        });
      });
      return describe('with a host and port', function() {
        return it('sets the API configuration to what was specified', function() {
          var api_config;
          api_config = Cylon.api({
            host: '0.0.0.0',
            port: '8888'
          });
          api_config.host.should.be.eql("0.0.0.0");
          return api_config.port.should.be.eql("8888");
        });
      });
    });
    describe("#robots", function() {
      return it("returns an array of all robots", function() {
        var robot, robots, _i, _len, _results;
        robots = Cylon.robots();
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
          return it("returns the robot", function() {
            var robot;
            robot = Cylon.findRobot("caprica six");
            assert(robot instanceof Robot);
            return robot.name.should.be.equal("caprica six");
          });
        });
        return describe("with an invalid robot name", function() {
          return it("returns null", function() {
            var robot;
            robot = Cylon.findRobot("Tom Servo");
            return assert(robot === null);
          });
        });
      });
      return describe("async", function() {
        describe("with a valid robot name", function() {
          return it("passes the robot and an empty error to the callback", function() {
            return Cylon.findRobot("caprica six", function(error, robot) {
              assert(error === void 0);
              assert(robot instanceof Robot);
              return robot.name.should.be.equal("caprica six");
            });
          });
        });
        return describe("with an invalid robot name", function() {
          return it("passes no robot and an error message to the callback", function() {
            return Cylon.findRobot("Tom Servo", function(error, robot) {
              assert(robot === null);
              assert(typeof error === 'object');
              return error.error.should.be.eql("No Robot found with the name Tom Servo");
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
          return it("returns the device", function() {
            var device;
            device = Cylon.findRobotDevice("Crow", "testDevice");
            assert(device instanceof Device);
            return device.name.should.be.equal("testDevice");
          });
        });
        return describe("with an invalid device name", function() {
          return it("returns null", function() {
            var device;
            device = Cylon.findRobotDevice("Crow", "madethisup");
            return assert(device === null);
          });
        });
      });
      return describe("async", function() {
        describe("with a valid robot and device name", function() {
          return it("passes the device and an empty error to the callback", function() {
            return Cylon.findRobotDevice("Crow", "testDevice", function(error, device) {
              assert(error === void 0);
              assert(device instanceof Device);
              return device.name.should.be.equal("testDevice");
            });
          });
        });
        return describe("with an invalid device name", function() {
          return it("passes no device and an error message to the callback", function() {
            return Cylon.findRobotDevice("Crow", "madethisup", function(err, device) {
              assert(device === null);
              assert(typeof err === 'object');
              return err.error.should.be.eql("No device found with the name madethisup.");
            });
          });
        });
      });
    });
    return describe("#findRobotConnection", function() {
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
          return it("returns the connection", function() {
            var connection;
            connection = Cylon.findRobotConnection("Ultron", "loopback");
            assert(connection instanceof Connection);
            return connection.name.should.be.equal("loopback");
          });
        });
        return describe("with an invalid connection name", function() {
          return it("returns null", function() {
            var connection;
            connection = Cylon.findRobotConnection("Ultron", "madethisup");
            return assert(connection === null);
          });
        });
      });
      return describe("async", function() {
        describe("with a valid robot and connection name", function() {
          return it("passes the connection and an empty error to the callback", function() {
            return Cylon.findRobotConnection("Ultron", "loopback", function(error, conn) {
              assert(error === void 0);
              assert(conn instanceof Connection);
              return conn.name.should.be.equal("loopback");
            });
          });
        });
        return describe("with an invalid connection name", function() {
          return it("passes no connection and an error message to the callback", function() {
            return Cylon.findRobotConnection("Ultron", "madethisup", function(err, conn) {
              var message;
              assert(conn === null);
              assert(typeof err === 'object');
              message = "No connection found with the name madethisup.";
              return err.error.should.be.eql(message);
            });
          });
        });
      });
    });
  });

}).call(this);
