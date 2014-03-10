"use strict";

var cylon = source("cylon");

describe("Cylon", function() {
  describe("#constructor", function() {
    it("sets @api_instance to null by default", function() {
      expect(cylon.api_instance).to.be.eql(null);
    });

    it("sets @api_config to an object containing host/port info", function() {
      var config = cylon.api_config;

      expect(config).to.be.an('object');
      expect(config.host).to.be.eql('127.0.0.1');
      expect(config.port).to.be.eql('3000');
    });

    it("sets @robots to an empty array by default", function() {
      expect(cylon.robots).to.be.eql([]);
    });

    it("sets @this to an circular instance to the master instance", function() {
      expect(cylon.self).to.be.eql(cylon);
    });
  });

  describe("#robot", function() {
    after(function() {
      cylon.robots = [];
    });

    it("uses passed options to create a new Robot", function() {
      var opts = { name: "Ultron" };
      var robot = cylon.robot(opts);

      expect(robot.toString()).to.be.eql("[Robot name='Ultron']")
      expect(cylon.robots.pop()).to.be.eql(robot);
    });
  });

  describe("#api", function() {
    afterEach(function() {
      cylon.api_config = { host: "127.0.0.1", port: "3000" };
    });

    context("without arguments", function() {
      it("returns the current API configuration", function() {
        cylon.api();
        var config = cylon.api_config;
        expect(config).to.be.eql({ host: "127.0.0.1", port: "3000" });
      });
    });

    context("only specifying port", function() {
      it("changes the port, but not the host", function() {
        cylon.api({ port: "4000" });
        var config = cylon.api_config;
        expect(config).to.be.eql({ host: "127.0.0.1", port: "4000" });
      });
    });

    context("only specifying host", function() {
      it("changes the host, but not the port", function() {
        cylon.api({ host: "0.0.0.0" });
        var config = cylon.api_config;
        expect(config).to.be.eql({ host: "0.0.0.0", port: "3000" });
      });
    });

    context("specifying new host and port", function() {
      it("changes both the host and port", function() {
        cylon.api({ host: "0.0.0.0", port: "4000" });
        var config = cylon.api_config;
        expect(config).to.be.eql({ host: "0.0.0.0", port: "4000" });
      });
    });
  });

  describe("#findRobot", function() {
    var bot;

    before(function() {
      bot = cylon.robot({ name: "Robby" })
    });

    describe("async", function() {
      context("looking for a robot that exists", function() {
        it("calls the callback with the robot", function() {
          var callback = spy();
          cylon.findRobot("Robby", callback);
          expect(callback).to.be.calledWith(undefined, bot);
        });
      });

      context("looking for a robot that does not exist", function(){
        it("calls the callback with no robot and an error message", function() {
          var callback = spy();
          cylon.findRobot("Ultron", callback);
          var error = { error: "No Robot found with the name Ultron" };
          expect(callback).to.be.calledWith(error, null);
        });
      });
    });

    describe("sync", function() {
      context("looking for a robot that exists", function() {
        it("returns the robot", function() {
          expect(cylon.findRobot("Robby")).to.be.eql(bot);
        });
      });

      context("looking for a robot that does not exist", function(){
        it("returns null", function() {
          expect(cylon.findRobot("Ultron")).to.be.eql(null);
        });
      });
    });
  });

  describe("#findRobotDevice", function() {
    var bot, device;

    before(function() {
      bot = cylon.robot({
        name: "Ultron",
        device: { name: "ping", driver: "ping" }
      });

      device = bot.devices.ping;
    });

    describe("async", function() {
      context("looking for a valid robot/device", function() {
        it("calls the callback with the device and no error message", function() {
          var callback = spy();
          cylon.findRobotDevice("Ultron", "ping", callback);
          expect(callback).to.be.calledWith(undefined, device);
        });
      });

      context("looking for a valid robot and invalid device", function() {
        it("calls the callback with no device and an error message", function() {
          var callback = spy();
          cylon.findRobotDevice("Ultron", "nope", callback);
          var error = { error: "No device found with the name nope." };
          expect(callback).to.be.calledWith(error, null);
        });
      });

      context("looking for an invalid robot", function() {
        it("calls the callback with no device and an error message", function() {
          var callback = spy();
          cylon.findRobotDevice("Rob", "ping", callback);
          var error = { error: "No Robot found with the name Rob" };
          expect(callback).to.be.calledWith(error, null);
        });
      });
    });

    describe("synchronous", function() {
      context("looking for a valid robot/device", function() {
        it("returns the device", function() {
          expect(cylon.findRobotDevice("Ultron", "ping")).to.be.eql(device);
        });
      });

      context("looking for a valid robot and invalid device", function() {
        it("returns null", function() {
          expect(cylon.findRobotDevice("Ultron", "nope")).to.be.eql(null);
        });
      });

      context("looking for an invalid robot", function() {
        it("returns null", function() {
          expect(cylon.findRobotDevice("Rob", "ping")).to.be.eql(null);
        });
      });
    });
  });

  describe("#findRobotConnection", function() {
    var bot, conn;

    before(function() {
      bot = cylon.robot({
        name: "JARVIS",
        connection: { name: "loopback", adaptor: "loopback" }
      });

      conn = bot.connections.loopback;
    });

    describe("async", function() {
      context("looking for a valid robot/connection", function() {
        it("calls the callback with the connection and no error message", function() {
          var callback = spy();
          cylon.findRobotConnection("JARVIS", "loopback", callback);
          expect(callback).to.be.calledWith(undefined, conn);
        });
      });

      context("looking for a valid robot and invalid connection", function() {
        it("calls the callback with no connection and an error message", function() {
          var callback = spy();
          cylon.findRobotConnection("JARVIS", "nope", callback);
          var error = { error: "No connection found with the name nope." };
          expect(callback).to.be.calledWith(error, null);
        });
      });

      context("looking for an invalid robot", function() {
        it("calls the callback with no connection and an error message", function() {
          var callback = spy();
          cylon.findRobotConnection("Rob", "loopback", callback);
          var error = { error: "No Robot found with the name Rob" };
          expect(callback).to.be.calledWith(error, null);
        });
      });
    });

    describe("synchronous", function() {
      context("looking for a valid robot/connection", function() {
        it("returns the connection", function() {
          expect(cylon.findRobotConnection("JARVIS", "loopback")).to.be.eql(conn);
        });
      });

      context("looking for a valid robot and invalid connection", function() {
        it("returns null", function() {
          expect(cylon.findRobotConnection("JARVIS", "nope")).to.be.eql(null);
        });
      });

      context("looking for an invalid robot", function() {
        it("returns null", function() {
          expect(cylon.findRobotConnection("Rob", "loopback")).to.be.eql(null);
        });
      });
    });
  });
});
